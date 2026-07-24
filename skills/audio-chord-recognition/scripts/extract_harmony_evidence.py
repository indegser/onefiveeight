#!/usr/bin/env python3
"""Extract non-authoritative harmony evidence for agent adjudication."""

import argparse
import json
import math
import sys
from pathlib import Path


NOTE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
CHORD_QUALITIES = {
    "": {"intervals": (0, 4, 7), "weights": (1.0, 0.88, 0.82), "complexity": 0.0},
    "m": {"intervals": (0, 3, 7), "weights": (1.0, 0.88, 0.82), "complexity": 0.0},
    "7": {
        "intervals": (0, 4, 7, 10),
        "weights": (1.0, 0.84, 0.76, 0.72),
        "complexity": 0.065,
        "extension": 10,
    },
    "maj7": {
        "intervals": (0, 4, 7, 11),
        "weights": (1.0, 0.84, 0.76, 0.70),
        "complexity": 0.075,
        "extension": 11,
    },
    "m7": {
        "intervals": (0, 3, 7, 10),
        "weights": (1.0, 0.84, 0.76, 0.70),
        "complexity": 0.065,
        "extension": 10,
    },
    "dim": {
        "intervals": (0, 3, 6),
        "weights": (1.0, 0.86, 0.78),
        "complexity": 0.025,
    },
    "sus4": {
        "intervals": (0, 5, 7),
        "weights": (1.0, 0.84, 0.78),
        "complexity": 0.025,
    },
}

KRUMHANSL_MAJOR = (6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88)
KRUMHANSL_MINOR = (6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17)


class EvidenceExtractionError(RuntimeError):
    """Raised when deterministic evidence cannot be extracted safely."""


def require_dependencies():
    try:
        import librosa
        import numpy
    except ImportError as exc:
        raise EvidenceExtractionError(
            "extract_harmony_evidence.py requires librosa and numpy"
        ) from exc
    return librosa, numpy


def build_tempo_hypotheses(observed_bpm, min_bpm=35.0, max_bpm=240.0):
    """Preserve metrical octave alternatives without selecting one."""
    if not observed_bpm or not math.isfinite(observed_bpm) or observed_bpm <= 0:
        return []
    candidates = [
        ("half_time", observed_bpm / 2.0, 0.68),
        ("observed_pulse", observed_bpm, 0.78),
        ("double_time", observed_bpm * 2.0, 0.68),
    ]
    hypotheses = []
    seen = set()
    for level, bpm, support in candidates:
        if not min_bpm <= bpm <= max_bpm:
            continue
        rounded = round(float(bpm), 3)
        identity = round(rounded, 1)
        if identity in seen:
            continue
        seen.add(identity)
        hypotheses.append(
            {
                "hypothesis_id": f"tempo-{level}",
                "metrical_level": level,
                "bpm": rounded,
                "evidence_support": support,
                "requires_agent_selection": True,
            }
        )
    return hypotheses


def normalize(values, numpy):
    array = numpy.maximum(numpy.asarray(values, dtype=float), 0)
    magnitude = float(numpy.linalg.norm(array))
    return array / magnitude if magnitude else array


def rotate_profile(profile, root, numpy):
    return numpy.roll(numpy.asarray(profile, dtype=float), root)


def score_key_hypotheses(chroma, numpy, limit=6):
    chroma = normalize(chroma, numpy)
    candidates = []
    for root in range(12):
        for scale, profile in (
            ("major", KRUMHANSL_MAJOR),
            ("minor", KRUMHANSL_MINOR),
        ):
            template = normalize(rotate_profile(profile, root, numpy), numpy)
            support = float(numpy.clip(numpy.dot(chroma, template), 0, 1))
            candidates.append(
                {
                    "key": f"{NOTE_NAMES[root]} {scale}",
                    "tonic_pitch_class": NOTE_NAMES[root],
                    "scale": scale,
                    "evidence_support": round(support, 4),
                }
            )
    candidates.sort(key=lambda item: item["evidence_support"], reverse=True)
    return candidates[:limit]


def score_chord_candidates(chroma, numpy, limit=5):
    """Return template candidates with restraint for unsupported complexity."""
    chroma = normalize(chroma, numpy)
    candidates = []
    for root in range(12):
        for suffix, quality in CHORD_QUALITIES.items():
            template = numpy.zeros(12)
            tones = []
            for interval, weight in zip(quality["intervals"], quality["weights"]):
                pitch_class = (root + interval) % 12
                tones.append(pitch_class)
                template[pitch_class] = weight
            template = normalize(template, numpy)
            template_support = float(numpy.clip(numpy.dot(chroma, template), 0, 1))
            outside = float(
                numpy.mean(
                    [chroma[pitch_class] for pitch_class in range(12) if pitch_class not in tones]
                )
            )

            extension_support = None
            complexity_penalty = quality["complexity"]
            if "extension" in quality:
                extension_pitch = (root + quality["extension"]) % 12
                triad_pitches = tones[:3]
                triad_mean = float(numpy.mean([chroma[pitch] for pitch in triad_pitches]))
                extension_support = float(
                    numpy.clip(chroma[extension_pitch] / max(triad_mean, 1e-8), 0, 1)
                )
                complexity_penalty *= 1.0 - extension_support

            support = float(
                numpy.clip(
                    template_support - 0.14 * outside - complexity_penalty,
                    0,
                    1,
                )
            )
            candidates.append(
                {
                    "chord": f"{NOTE_NAMES[root]}{suffix}",
                    "root_pitch_class": NOTE_NAMES[root],
                    "quality": suffix or "major",
                    "evidence_support": round(support, 4),
                    "template_support": round(template_support, 4),
                    "complexity_penalty": round(float(complexity_penalty), 4),
                    "extension_tone_support": (
                        round(extension_support, 4)
                        if extension_support is not None
                        else None
                    ),
                }
            )
    candidates.sort(key=lambda item: item["evidence_support"], reverse=True)
    for rank, candidate in enumerate(candidates[:limit], start=1):
        candidate["rank"] = rank
    return candidates[:limit]


def summarize_pitch_classes(energy, numpy, limit=3):
    energy = numpy.maximum(numpy.asarray(energy, dtype=float), 0)
    total = float(energy.sum())
    if total <= 0:
        return []
    order = numpy.argsort(energy)[::-1]
    return [
        {
            "pitch_class": NOTE_NAMES[int(index)],
            "evidence_support": round(float(energy[index] / total), 4),
        }
        for index in order[:limit]
    ]


def aggregate_frames(feature, frame_times, start, end, numpy):
    mask = (frame_times >= start) & (frame_times < end)
    if int(mask.sum()) == 0:
        return None
    return numpy.median(feature[:, mask], axis=1)


def load_source(path, sample_rate, librosa):
    audio, _ = librosa.load(str(path), sr=sample_rate, mono=True)
    if len(audio) == 0:
        raise EvidenceExtractionError(f"Audio source is empty: {path}")
    return audio


def build_grid_hypotheses(beat_times, tempo_hypotheses, meter_beats):
    if len(beat_times) == 0:
        return []
    base_anchor = float(beat_times[0])
    grids = []
    for tempo in tempo_hypotheses:
        period = 60.0 / tempo["bpm"]
        anchors = []
        for phase in range(meter_beats):
            anchor = base_anchor + phase * period
            anchors.append(
                {
                    "phase_index": phase,
                    "anchor_seconds": round(anchor, 4),
                    "bar_period_seconds": round(period * meter_beats, 6),
                }
            )
        grids.append(
            {
                "grid_id": f"grid-{tempo['metrical_level']}",
                "tempo_hypothesis_id": tempo["hypothesis_id"],
                "meter_hypothesis": f"{meter_beats}/4",
                "beat_period_seconds": round(period, 6),
                "anchor_candidates": anchors,
                "requires_agent_selection": True,
            }
        )
    return grids


def build_recurrence_candidates(
    segment_ids, vectors, numpy, limit=3, min_separation=2
):
    """Measure non-adjacent chroma similarity without assigning form."""
    recurrence = []
    for index, (segment_id, vector) in enumerate(zip(segment_ids, vectors)):
        normalized = normalize(vector, numpy)
        peers = []
        for peer_index, (peer_id, peer_vector) in enumerate(zip(segment_ids, vectors)):
            if abs(peer_index - index) < min_separation:
                continue
            peer_normalized = normalize(peer_vector, numpy)
            similarity = float(
                numpy.clip(numpy.dot(normalized, peer_normalized), 0, 1)
            )
            peers.append(
                {
                    "segment_id": peer_id,
                    "similarity_support": round(similarity, 4),
                }
            )
        peers.sort(key=lambda item: item["similarity_support"], reverse=True)
        recurrence.append(
            {
                "segment_id": segment_id,
                "peers": peers[:limit],
                "requires_agent_interpretation": True,
            }
        )
    return recurrence


def extract(args):
    librosa, numpy = require_dependencies()
    full_mix_path = Path(args.input).expanduser().resolve()
    harmonic_path = (
        Path(args.harmonic_source).expanduser().resolve()
        if args.harmonic_source
        else full_mix_path
    )
    bass_path = (
        Path(args.bass_source).expanduser().resolve()
        if args.bass_source
        else harmonic_path
    )
    for path in {full_mix_path, harmonic_path, bass_path}:
        if not path.exists():
            raise EvidenceExtractionError(f"Audio source does not exist: {path}")

    full_mix = load_source(full_mix_path, args.sample_rate, librosa)
    harmonic = (
        full_mix
        if harmonic_path == full_mix_path
        else load_source(harmonic_path, args.sample_rate, librosa)
    )
    bass_audio = (
        harmonic
        if bass_path == harmonic_path
        else load_source(bass_path, args.sample_rate, librosa)
    )
    duration = min(
        librosa.get_duration(y=full_mix, sr=args.sample_rate),
        librosa.get_duration(y=harmonic, sr=args.sample_rate),
        librosa.get_duration(y=bass_audio, sr=args.sample_rate),
    )

    tempo_result, beat_times = librosa.beat.beat_track(
        y=harmonic,
        sr=args.sample_rate,
        hop_length=args.hop_length,
        units="time",
        sparse=True,
    )
    observed_bpm = float(numpy.ravel(tempo_result)[0]) if numpy.size(tempo_result) else 0
    tempo_hypotheses = build_tempo_hypotheses(observed_bpm)
    beat_grid_hypotheses = build_grid_hypotheses(
        beat_times, tempo_hypotheses, args.meter_beats
    )

    source_audio = {"full_mix": full_mix}
    if harmonic_path != full_mix_path:
        source_audio["harmonic"] = harmonic
    chroma_by_source = {}
    for role, audio in source_audio.items():
        chroma = librosa.feature.chroma_cqt(
            y=audio,
            sr=args.sample_rate,
            hop_length=args.hop_length,
            bins_per_octave=36,
        )
        chroma_by_source[role] = {
            "feature": chroma,
            "times": librosa.times_like(
                chroma, sr=args.sample_rate, hop_length=args.hop_length
            ),
        }

    bass_cqt = numpy.abs(
        librosa.cqt(
            bass_audio,
            sr=args.sample_rate,
            hop_length=args.hop_length,
            fmin=librosa.note_to_hz("C1"),
            n_bins=36,
            bins_per_octave=12,
        )
    )
    bass_times = librosa.times_like(
        bass_cqt, sr=args.sample_rate, hop_length=args.hop_length
    )

    harmonic_chroma = chroma_by_source.get(
        "harmonic", chroma_by_source["full_mix"]
    )["feature"]
    global_chroma = numpy.median(harmonic_chroma, axis=1)
    key_hypotheses = score_key_hypotheses(global_chroma, numpy)

    warnings = []
    if harmonic_path == full_mix_path:
        warnings.append(
            "No harmonic source was supplied; vocal and drum interference may reduce chord evidence quality."
        )
    if args.bass_source is None:
        warnings.append(
            "No dedicated bass source was supplied; bass candidates use low-register energy from the harmonic source."
        )
    if len(tempo_hypotheses) < 2:
        warnings.append(
            "Fewer than two plausible metrical levels were extracted; the agent must inspect tempo manually."
        )

    evidence_segments = []
    candidate_segments = []
    segment_ids = []
    segment_vectors = []
    segment_count = min(
        int(math.ceil(duration / args.segment_seconds)), args.max_segments
    )
    for index in range(segment_count):
        start = index * args.segment_seconds
        end = min(duration, start + args.segment_seconds)
        if end - start < 0.1:
            continue
        segment_id = f"fixed-{index + 1:04d}"
        source_chroma = {}
        for role, source_features in chroma_by_source.items():
            aggregate = aggregate_frames(
                source_features["feature"],
                source_features["times"],
                start,
                end,
                numpy,
            )
            if aggregate is not None:
                normalized = normalize(aggregate, numpy)
                source_chroma[role] = {
                    NOTE_NAMES[pitch_class]: round(float(normalized[pitch_class]), 4)
                    for pitch_class in range(12)
                }

        bass_aggregate = aggregate_frames(
            bass_cqt, bass_times, start, end, numpy
        )
        bass_candidates = []
        if bass_aggregate is not None:
            pitch_energy = numpy.array(
                [
                    float(
                        numpy.max(
                            bass_aggregate[
                                numpy.arange(len(bass_aggregate)) % 12 == pitch_class
                            ]
                        )
                    )
                    for pitch_class in range(12)
                ]
            )
            bass_candidates = summarize_pitch_classes(pitch_energy, numpy)

        candidate_chroma = source_chroma.get(
            "harmonic", source_chroma.get("full_mix")
        )
        if candidate_chroma is None:
            continue
        candidate_vector = [candidate_chroma[note] for note in NOTE_NAMES]
        chord_candidates = score_chord_candidates(candidate_vector, numpy)
        segment_ids.append(segment_id)
        segment_vectors.append(candidate_vector)
        evidence_segments.append(
            {
                "segment_id": segment_id,
                "start": round(start, 4),
                "end": round(end, 4),
                "resolution": "fixed_window",
                "chroma_by_source": source_chroma,
                "bass_candidates": bass_candidates,
                "warnings": [],
            }
        )
        candidate_segments.append(
            {
                "segment_id": segment_id,
                "start": round(start, 4),
                "end": round(end, 4),
                "do_not_select_automatically": True,
                "candidates": chord_candidates,
                "agent_review_required": True,
            }
        )

    recurrence_candidates = build_recurrence_candidates(
        segment_ids, segment_vectors, numpy
    )
    evidence_ready = (
        len(tempo_hypotheses) >= 2
        and len(beat_grid_hypotheses) >= 1
        and len(evidence_segments) >= 1
    )
    if not evidence_ready:
        warnings.append(
            "Evidence is partial; tempo, beat-grid, or segment measurements require manual recovery."
        )

    source_manifest = [
        {"role": "full_mix", "path": str(full_mix_path)}
    ]
    if harmonic_path != full_mix_path:
        source_manifest.append({"role": "harmonic", "path": str(harmonic_path)})
    if bass_path not in {full_mix_path, harmonic_path}:
        source_manifest.append({"role": "bass", "path": str(bass_path)})

    evidence = {
        "artifact_type": "harmony_evidence",
        "artifact_version": "1.0",
        "role": "measurement_only",
        "status": "evidence_ready" if evidence_ready else "partial_evidence",
        "do_not_select_automatically": True,
        "audio": {
            "path": str(full_mix_path),
            "duration_seconds": round(float(duration), 4),
            "sample_rate": args.sample_rate,
        },
        "sources": source_manifest,
        "tempo_hypotheses": tempo_hypotheses,
        "beat_grid_hypotheses": beat_grid_hypotheses,
        "key_hypotheses": key_hypotheses,
        "segments": evidence_segments,
        "recurrence_candidates": recurrence_candidates,
        "warnings": warnings,
    }
    candidates = {
        "artifact_type": "chord_candidates",
        "artifact_version": "1.0",
        "role": "measurement_only",
        "do_not_select_automatically": True,
        "source_artifact": "04_harmony_evidence.json",
        "score_semantics": (
            "evidence_support ranks template fit only; it is not decision confidence"
        ),
        "segments": candidate_segments,
        "warnings": warnings,
    }
    return evidence, candidates


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", help="Full-mix audio path")
    parser.add_argument("--workdir", required=True, help="Output artifact directory")
    parser.add_argument("--harmonic-source", help="Optional vocal-reduced or other stem")
    parser.add_argument("--bass-source", help="Optional dedicated bass stem")
    parser.add_argument("--sample-rate", type=int, default=22050)
    parser.add_argument("--hop-length", type=int, default=512)
    parser.add_argument("--segment-seconds", type=float, default=2.0)
    parser.add_argument("--meter-beats", type=int, default=4)
    parser.add_argument("--max-segments", type=int, default=256)
    args = parser.parse_args()
    if args.segment_seconds <= 0:
        parser.error("--segment-seconds must be positive")
    if args.meter_beats <= 0:
        parser.error("--meter-beats must be positive")
    if args.max_segments <= 0:
        parser.error("--max-segments must be positive")

    try:
        evidence, candidates = extract(args)
    except (EvidenceExtractionError, OSError, ValueError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2

    workdir = Path(args.workdir).expanduser().resolve()
    workdir.mkdir(parents=True, exist_ok=True)
    evidence_path = workdir / "04_harmony_evidence.json"
    candidates_path = workdir / "05_chord_candidates.json"
    evidence_path.write_text(
        json.dumps(evidence, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    candidates_path.write_text(
        json.dumps(candidates, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        json.dumps(
            {
                "evidence": str(evidence_path),
                "candidates": str(candidates_path),
                "segments": len(evidence["segments"]),
                "do_not_select_automatically": True,
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
