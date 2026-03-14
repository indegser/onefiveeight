#!/usr/bin/env python3

import hashlib
import importlib.util
import json
import math
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import librosa
import numpy as np


PITCH_CLASSES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
ROOT_TEMPLATE = np.array([1.0] + [0.0] * 11, dtype=float)


def sanitize_track_name(file_path: str) -> str:
    return Path(file_path).stem


def pitch_class(index: int) -> str:
    return PITCH_CLASSES[index % 12]


def normalize_vector(vector: np.ndarray) -> np.ndarray:
    norm = np.linalg.norm(vector)
    return vector if norm == 0 else vector / norm


def rotate_template(intervals: List[Tuple[int, float]], root_index: int) -> np.ndarray:
    template = np.full(12, 0.04, dtype=float)

    for interval, weight in intervals:
        template[(root_index + interval) % 12] = weight

    return normalize_vector(template)


def build_chord_templates():
    templates = []

    for index, root in enumerate(PITCH_CLASSES):
        templates.append((root, rotate_template([(0, 1.0), (4, 0.85), (7, 0.74)], index)))
        templates.append((f"{root}m", rotate_template([(0, 1.0), (3, 0.87), (7, 0.74)], index)))
        templates.append((f"{root}7", rotate_template([(0, 1.0), (4, 0.82), (7, 0.67), (10, 0.6)], index)))
        templates.append((f"{root}dim", rotate_template([(0, 1.0), (3, 0.8), (6, 0.72)], index)))
        templates.append((f"{root}m7b5", rotate_template([(0, 1.0), (3, 0.78), (6, 0.7), (10, 0.55)], index)))
        templates.append((f"{root}sus4", rotate_template([(0, 1.0), (5, 0.86), (7, 0.74)], index)))

    return templates


CHORD_TEMPLATES = build_chord_templates()
CHORD_LABELS = [label for label, _ in CHORD_TEMPLATES]
CHORD_TEMPLATE_MAP = {label: template for label, template in CHORD_TEMPLATES}


def chord_root(symbol: str) -> str:
    if len(symbol) > 1 and symbol[1] in ("#", "b"):
        return symbol[:2]

    return symbol[:1]


def root_compatibility(symbol: str, root: Optional[str]) -> float:
    if not root:
        return 0.0

    return 0.18 if chord_root(symbol) == root else -0.06


def transition_score(previous: str, current: str) -> float:
    if previous == current:
        return 0.28

    prev_root = chord_root(previous)
    curr_root = chord_root(current)

    prev_index = PITCH_CLASSES.index(prev_root)
    curr_index = PITCH_CLASSES.index(curr_root)
    distance = (curr_index - prev_index) % 12

    if distance in (5, 7):
        return 0.14

    if distance in (0, 3, 4, 8, 9):
        return 0.05

    return -0.08


def has_demucs() -> bool:
    return importlib.util.find_spec("demucs") is not None


def split_with_demucs(file_path: str):
    cache_root = Path.home() / ".cache" / "onefiveeight" / "music-analysis" / "demucs"
    track_hash = hashlib.sha1(Path(file_path).resolve().as_posix().encode("utf8")).hexdigest()[:12]
    output_root = cache_root / track_hash
    track_name = sanitize_track_name(file_path)
    model_name = "htdemucs"
    stem_dir = output_root / model_name / track_name

    if not stem_dir.exists():
        output_root.mkdir(parents=True, exist_ok=True)
        command = [
            sys.executable,
            "-m",
            "demucs.separate",
            "-n",
            model_name,
            "-d",
            "cpu",
            "--segment",
            "7",
            "-o",
            output_root.as_posix(),
            file_path,
        ]
        subprocess.run(
            command,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

    stems = {
        stem: (stem_dir / f"{stem}.wav").as_posix()
        for stem in ("bass", "drums", "vocals", "other")
        if (stem_dir / f"{stem}.wav").exists()
    }

    if len(stems) < 3:
        raise RuntimeError("Demucs did not produce the expected stem files.")

    return {
        "engine": "demucs",
        "directory": stem_dir.as_posix(),
        "stems": stems,
    }


def harmonic_percussive_fallback(y: np.ndarray, sr: int):
    harmonic, percussive = librosa.effects.hpss(y)
    return {
        "engine": "hpss",
        "signals": {
            "drums": percussive,
            "other": harmonic,
            "bass": harmonic,
            "vocals": np.zeros_like(y),
        },
        "directory": None,
        "stems": {},
    }


def load_signal(path_or_signal, sr: int) -> np.ndarray:
    if isinstance(path_or_signal, np.ndarray):
        return path_or_signal

    signal, _ = librosa.load(path_or_signal, sr=sr, mono=True)
    return signal


def choose_meter(onset_env: np.ndarray, beat_frames: np.ndarray) -> Tuple[int, float]:
    if len(beat_frames) < 8:
        return (4, 0.22)

    accent_strengths = []

    for frame in beat_frames:
        left = max(int(frame) - 1, 0)
        right = min(int(frame) + 2, onset_env.shape[0])
        accent_strengths.append(float(np.mean(onset_env[left:right])))

    best_beats_per_bar = 4
    best_score = float("-inf")

    for beats_per_bar in (3, 4):
        groups = [
            accent_strengths[index : index + beats_per_bar]
            for index in range(0, len(accent_strengths), beats_per_bar)
            if len(accent_strengths[index : index + beats_per_bar]) == beats_per_bar
        ]

        if not groups:
            continue

        downbeat_gain = np.mean([group[0] - np.mean(group[1:]) for group in groups])
        group_consistency = -np.std([value for group in groups for value in group])
        score = float(downbeat_gain + 0.08 * group_consistency)

        if score > best_score:
            best_score = score
            best_beats_per_bar = beats_per_bar

    confidence = max(0.25, min(0.9, 0.45 + best_score * 2.2))
    return best_beats_per_bar, confidence


def build_beat_and_bar_grids(
    beat_frames: np.ndarray,
    sr: int,
    onset_env: np.ndarray,
    duration_seconds: float,
):
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)
    beats = [
        {"index": index, "time": float(time)}
        for index, time in enumerate(beat_times)
    ]

    beats_per_bar, meter_confidence = choose_meter(onset_env, beat_frames)
    downbeats = []
    bars = []

    for bar_index, beat_index in enumerate(range(0, len(beat_times), beats_per_bar)):
        if beat_index >= len(beat_times):
            break

        end_beat_index = min(beat_index + beats_per_bar, len(beat_times))
        start_time = float(beat_times[beat_index])
        end_time = (
            float(beat_times[end_beat_index])
            if end_beat_index < len(beat_times)
            else duration_seconds
        )

        downbeats.append(
            {
                "beatIndex": beat_index,
                "time": start_time,
                "confidence": round(meter_confidence, 4),
            }
        )
        bars.append(
            {
                "index": bar_index,
                "startBeat": beat_index,
                "endBeat": end_beat_index,
                "startTime": start_time,
                "endTime": end_time,
                "confidence": round(meter_confidence, 4),
            }
        )

    return beats, downbeats, bars, f"{beats_per_bar}/4", meter_confidence


def average_chroma(chroma: np.ndarray, sr: int, start_time: float, end_time: float) -> np.ndarray:
    hop_length = 512
    start_frame = librosa.time_to_frames(start_time, sr=sr, hop_length=hop_length)
    end_frame = librosa.time_to_frames(end_time, sr=sr, hop_length=hop_length)
    window = chroma[:, start_frame:max(start_frame + 1, end_frame)]

    if window.shape[1] == 0:
        return np.zeros(12, dtype=float)

    return normalize_vector(np.mean(window, axis=1))


def top_root_candidates(bass_chroma: np.ndarray, sr: int, start_time: float, end_time: float):
    vector = average_chroma(bass_chroma, sr, start_time, end_time)

    if not np.any(vector):
        return []

    scores = sorted(
        [
            {
                "root": pitch_class(index),
                "confidence": float(vector[index]),
            }
            for index in range(12)
        ],
        key=lambda item: item["confidence"],
        reverse=True,
    )[:3]

    total = sum(item["confidence"] for item in scores) or 1.0

    return [
        {
            "root": item["root"],
            "confidence": round(item["confidence"] / total, 4),
        }
        for item in scores
    ]


def top_chord_candidates(
    harmony_chroma: np.ndarray,
    bass_chroma: np.ndarray,
    sr: int,
    start_time: float,
    end_time: float,
):
    harmony_vector = average_chroma(harmony_chroma, sr, start_time, end_time)
    roots = top_root_candidates(bass_chroma, sr, start_time, end_time)
    primary_root = roots[0]["root"] if roots else None
    scored = []

    for label, template in CHORD_TEMPLATES:
        harmony_score = float(np.dot(harmony_vector, template))
        scored.append(
            {
                "symbol": label,
                "score": harmony_score + root_compatibility(label, primary_root),
            }
        )

    scored.sort(key=lambda item: item["score"], reverse=True)
    top = scored[:4]
    best = top[0]["score"] if top else 1.0
    normalized = []

    for item in top:
        confidence = max(0.12, min(0.95, 0.25 + (item["score"] / max(best, 0.0001)) * 0.55))
        normalized.append(
            {
                "symbol": item["symbol"],
                "confidence": round(float(confidence), 4),
            }
        )

    return roots, normalized


def viterbi_decode(frame_candidates):
    if not frame_candidates:
        return []

    states_per_bar = [
        [candidate["symbol"] for candidate in frame["candidates"]]
        for frame in frame_candidates
    ]
    emissions = [
        {candidate["symbol"]: candidate["confidence"] for candidate in frame["candidates"]}
        for frame in frame_candidates
    ]

    dp = []
    backpointers = []

    first_scores = {state: emissions[0].get(state, 0.0) for state in states_per_bar[0]}
    dp.append(first_scores)
    backpointers.append({state: None for state in states_per_bar[0]})

    for index in range(1, len(states_per_bar)):
        scores = {}
        backs = {}

        for state in states_per_bar[index]:
            best_prev = None
            best_score = float("-inf")

            for prev_state, prev_score in dp[index - 1].items():
                score = prev_score + emissions[index].get(state, 0.0) + transition_score(prev_state, state)

                if score > best_score:
                    best_score = score
                    best_prev = prev_state

            scores[state] = best_score
            backs[state] = best_prev

        dp.append(scores)
        backpointers.append(backs)

    last_state = max(dp[-1], key=dp[-1].get)
    path = [last_state]

    for index in range(len(states_per_bar) - 1, 0, -1):
        last_state = backpointers[index][last_state]
        path.append(last_state)

    path.reverse()
    return path


def merge_path_to_chords(path, bars, frame_candidates):
    if not path:
        return []

    merged = []
    current_symbol = path[0]
    start_bar = 0

    for index in range(1, len(path) + 1):
        if index < len(path) and path[index] == current_symbol:
            continue

        relevant_frames = frame_candidates[start_bar:index]
        average_confidence = float(
            np.mean(
                [
                    next(
                        (
                            candidate["confidence"]
                            for candidate in frame["candidates"]
                            if candidate["symbol"] == current_symbol
                        ),
                        0.35,
                    )
                    for frame in relevant_frames
                ]
            )
        )
        merged.append(
            {
                "symbol": current_symbol,
                "confidence": round(average_confidence, 4),
                "startBeat": bars[start_bar]["startBeat"],
                "endBeat": bars[index - 1]["endBeat"],
                "startBar": start_bar,
                "endBar": index,
            }
        )

        if index < len(path):
            current_symbol = path[index]
            start_bar = index

    return merged


def analyze(file_path: str):
    y, sr = librosa.load(file_path, sr=22050, mono=True)
    duration_seconds = float(librosa.get_duration(y=y, sr=sr))
    uncertainty = []
    stages = [
        {
            "stage": "preprocess",
            "status": "passed",
            "details": f"Loaded mono analysis signal at {sr} Hz.",
        }
    ]

    separation = None
    bass_signal = y
    drums_signal = y
    harmony_signal = y

    try:
        if has_demucs():
            separation = split_with_demucs(file_path)
            bass_signal = load_signal(separation["stems"]["bass"], sr)
            drums_signal = load_signal(separation["stems"]["drums"], sr)
            harmony_signal = load_signal(separation["stems"]["other"], sr)
            stages.append(
                {
                    "stage": "separation",
                    "status": "passed",
                    "details": "Used Demucs stems for drums, bass, and other/harmony analysis.",
                }
            )
        else:
            raise RuntimeError("Demucs is unavailable in the current Python environment.")
    except Exception as exc:
        fallback = harmonic_percussive_fallback(y, sr)
        separation = {
            "engine": fallback["engine"],
            "directory": None,
            "stems": {},
        }
        bass_signal = fallback["signals"]["bass"]
        drums_signal = fallback["signals"]["drums"]
        harmony_signal = fallback["signals"]["other"]
        stages.append(
            {
                "stage": "separation",
                "status": "failed",
                "details": f"Demucs separation failed, falling back to HPSS: {exc}",
            }
        )
        uncertainty.append(
            {
                "scope": "source",
                "ref": file_path,
                "severity": "medium",
                "message": f"Demucs separation was unavailable or failed: {exc}",
                "recommendation": "Install Demucs correctly or inspect the source stems if bar and chord accuracy remain weak.",
            }
        )

    onset_env = librosa.onset.onset_strength(y=drums_signal, sr=sr)
    tempo_raw, beat_frames = librosa.beat.beat_track(
        y=drums_signal,
        sr=sr,
        onset_envelope=onset_env,
        trim=False,
    )
    tempo = float(np.asarray(tempo_raw).reshape(-1)[0]) if np.size(tempo_raw) else 0.0
    beat_frames = np.asarray(beat_frames, dtype=int)

    if beat_frames.size < 2:
        uncertainty.append(
            {
                "scope": "source",
                "ref": file_path,
                "severity": "high",
                "message": "Beat tracking produced too few anchors for bar-level harmony estimation.",
                "recommendation": "Retry with a less noisy source or add symbolic evidence for cross-checking.",
            }
        )
        return {
            "bpm": tempo or None,
            "meterHint": "4/4",
            "beats": [],
            "downbeats": [],
            "bars": [],
            "rootCandidates": [],
            "frameChordCandidates": [],
            "chordCandidates": [],
            "separationArtifacts": separation,
            "stages": stages,
            "uncertainty": uncertainty,
        }

    beats, downbeats, bars, meter_hint, meter_confidence = build_beat_and_bar_grids(
        beat_frames,
        sr,
        onset_env,
        duration_seconds,
    )
    stages.append(
        {
            "stage": "rhythm",
            "status": "passed",
            "details": f"Derived {len(beats)} beats and {len(bars)} bars with meter hint {meter_hint}.",
        }
    )

    if meter_confidence < 0.55:
        uncertainty.append(
            {
                "scope": "meter",
                "ref": file_path,
                "severity": "medium",
                "message": f"Bar tracking confidence is modest for inferred meter {meter_hint}.",
                "recommendation": "Review bar boundaries manually before publishing a final lead sheet.",
            }
        )

    root_candidates = []
    frame_chord_candidates = []
    bass_chroma = librosa.feature.chroma_cqt(y=bass_signal, sr=sr, hop_length=512)
    harmony_chroma = librosa.feature.chroma_cqt(y=harmony_signal, sr=sr, hop_length=512)

    for bar in bars:
        roots, chords = top_chord_candidates(
            harmony_chroma,
            bass_chroma,
            sr,
            bar["startTime"],
            bar["endTime"],
        )
        root_candidates.append(
            {
                "barIndex": bar["index"],
                "root": roots[0]["root"] if roots else "Unknown",
                "confidence": roots[0]["confidence"] if roots else 0.2,
                "alternatives": roots[1:] if len(roots) > 1 else [],
            }
        )
        frame_chord_candidates.append(
            {
                "barIndex": bar["index"],
                "candidates": chords,
            }
        )

    stages.append(
        {
            "stage": "harmony",
            "status": "passed",
            "details": "Built per-bar bass-root candidates and harmony-aware chord candidates.",
        }
    )

    if not any(frame["candidates"] for frame in frame_chord_candidates):
        uncertainty.append(
            {
                "scope": "analysis",
                "ref": file_path,
                "severity": "high",
                "message": "Harmony extraction did not produce usable bar-level chord candidates.",
                "recommendation": "Inspect the separated stems or provide symbolic evidence.",
            }
        )

    path = viterbi_decode(frame_chord_candidates)
    chord_candidates = merge_path_to_chords(path, bars, frame_chord_candidates)
    stages.append(
        {
            "stage": "smoothing",
            "status": "passed",
            "details": f"Decoded a smoothed chord path over {len(bars)} bars.",
        }
    )

    average_confidence = float(np.mean([item["confidence"] for item in chord_candidates])) if chord_candidates else 0.0

    if average_confidence < 0.62:
        uncertainty.append(
            {
                "scope": "analysis",
                "ref": file_path,
                "severity": "medium",
                "message": "Average chord confidence remains low after multi-stage smoothing.",
                "recommendation": "Treat this as a draft chart and confirm the weak bars against symbolic evidence.",
            }
        )

    if separation and separation["engine"] != "demucs":
        uncertainty.append(
            {
                "scope": "analysis",
                "ref": file_path,
                "severity": "medium",
                "message": "Stem-assisted re-ranking is degraded because Demucs stems were unavailable.",
                "recommendation": "Use Demucs-enabled analysis for higher root and bar accuracy.",
            }
        )

    stages.append(
        {
            "stage": "aggregation",
            "status": "passed",
            "details": f"Merged smoothed chord path into {len(chord_candidates)} draft chord spans.",
        }
    )

    return {
        "bpm": round(tempo, 2) if tempo else None,
        "meterHint": meter_hint,
        "beats": beats,
        "downbeats": downbeats,
        "bars": bars,
        "rootCandidates": root_candidates,
        "frameChordCandidates": frame_chord_candidates,
        "chordCandidates": chord_candidates,
        "separationArtifacts": separation,
        "stages": stages,
        "uncertainty": uncertainty,
    }


def main():
    if len(sys.argv) != 2:
        print("Usage: librosa-audio-analysis.py <audio-file>", file=sys.stderr)
        sys.exit(1)

    try:
        result = analyze(sys.argv[1])
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
        sys.exit(2)

    print(json.dumps(result))


if __name__ == "__main__":
    main()
