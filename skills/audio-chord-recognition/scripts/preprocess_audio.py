#!/usr/bin/env python3
"""Inspect audio portably and optionally create a WAV working copy."""

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


COMMON_BINARY_ROOTS = [
    Path("/opt/homebrew/bin"),
    Path("/usr/local/bin"),
    Path("/usr/bin"),
]


def find_binary(name, explicit=None):
    """Resolve a multimedia binary without assuming the interactive shell PATH."""
    if explicit:
        path = Path(explicit).expanduser().resolve()
        return str(path) if path.is_file() and os.access(path, os.X_OK) else None

    discovered = shutil.which(name)
    if discovered:
        return discovered

    sibling_name = "ffmpeg" if name == "ffprobe" else "ffprobe"
    sibling = shutil.which(sibling_name)
    if sibling:
        candidate = Path(sibling).resolve().with_name(name)
        if candidate.is_file() and os.access(candidate, os.X_OK):
            return str(candidate)

    candidates = [root / name for root in COMMON_BINARY_ROOTS]
    candidates.extend(
        sorted(
            Path("/opt/homebrew/Cellar/ffmpeg").glob(f"*/bin/{name}"),
            reverse=True,
        )
    )
    for candidate in candidates:
        if candidate.is_file() and os.access(candidate, os.X_OK):
            return str(candidate)
    return None


def run_json(cmd):
    result = subprocess.run(cmd, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def inspect_with_ffprobe(input_path, ffprobe):
    probe = run_json(
        [
            ffprobe,
            "-v",
            "error",
            "-show_entries",
            "format=duration:stream=codec_type,sample_rate,channels",
            "-of",
            "json",
            str(input_path),
        ]
    )
    audio_streams = [
        stream
        for stream in probe.get("streams", [])
        if stream.get("codec_type") == "audio"
    ]
    if not audio_streams:
        raise ValueError("No audio stream found")
    stream = audio_streams[0]
    return {
        "duration_seconds": float(probe.get("format", {}).get("duration") or 0),
        "sample_rate": int(stream.get("sample_rate") or 0),
        "channels": int(stream.get("channels") or 0),
        "inspection_backend": "ffprobe",
    }


def inspect_with_soundfile(input_path):
    try:
        import soundfile
    except ImportError as exc:
        raise RuntimeError(
            "ffprobe was not found and the Python soundfile fallback is unavailable"
        ) from exc

    try:
        info = soundfile.info(str(input_path))
    except Exception as exc:
        raise RuntimeError(
            "Unable to inspect audio with ffprobe or Python soundfile"
        ) from exc
    return {
        "duration_seconds": float(info.duration),
        "sample_rate": int(info.samplerate),
        "channels": int(info.channels),
        "inspection_backend": "soundfile",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", help="Input audio file")
    parser.add_argument("--workdir", required=True, help="Directory for output artifacts")
    parser.add_argument("--sample-rate", type=int, default=44100)
    parser.add_argument("--channels", type=int, default=2)
    parser.add_argument("--no-convert", action="store_true", help="Only inspect metadata")
    parser.add_argument("--ffmpeg", help="Explicit ffmpeg executable")
    parser.add_argument("--ffprobe", help="Explicit ffprobe executable")
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    workdir = Path(args.workdir).expanduser().resolve()
    workdir.mkdir(parents=True, exist_ok=True)

    if not input_path.exists():
        print(json.dumps({"error": f"Input does not exist: {input_path}"}), file=sys.stderr)
        return 2

    warnings = []
    ffprobe = find_binary("ffprobe", args.ffprobe)
    ffmpeg = find_binary("ffmpeg", args.ffmpeg)
    if args.ffprobe and ffprobe is None:
        print(
            json.dumps(
                {"error": f"Explicit ffprobe executable is not usable: {args.ffprobe}"}
            ),
            file=sys.stderr,
        )
        return 2
    if args.ffmpeg and ffmpeg is None and not args.no_convert:
        print(
            json.dumps(
                {"error": f"Explicit ffmpeg executable is not usable: {args.ffmpeg}"}
            ),
            file=sys.stderr,
        )
        return 2
    try:
        if ffprobe:
            metadata = inspect_with_ffprobe(input_path, ffprobe)
        else:
            metadata = inspect_with_soundfile(input_path)
            warnings.append(
                "ffprobe was not found; metadata was inspected with Python soundfile"
            )
    except (RuntimeError, ValueError, subprocess.CalledProcessError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 3

    duration = metadata["duration_seconds"]
    sample_rate = metadata["sample_rate"]
    channels = metadata["channels"]
    audio_path = input_path

    if not args.no_convert:
        if ffmpeg is None:
            warnings.append(
                "ffmpeg was not found; using the original audio path without conversion"
            )
        else:
            output_path = workdir / f"{input_path.stem}.analysis.wav"
            try:
                subprocess.run(
                    [
                        ffmpeg,
                        "-y",
                        "-v",
                        "error",
                        "-i",
                        str(input_path),
                        "-vn",
                        "-ac",
                        str(args.channels),
                        "-ar",
                        str(args.sample_rate),
                        str(output_path),
                    ],
                    check=True,
                    capture_output=True,
                    text=True,
                )
            except subprocess.CalledProcessError as exc:
                detail = (exc.stderr or "").strip() or "unknown ffmpeg error"
                print(
                    json.dumps(
                        {"error": f"ffmpeg conversion failed: {detail}"}
                    ),
                    file=sys.stderr,
                )
                return 4
            audio_path = output_path
            sample_rate = args.sample_rate
            channels = args.channels

    payload = {
        "audio_path": str(audio_path),
        "duration_seconds": duration,
        "sample_rate": sample_rate,
        "channels": channels,
        "inspection_backend": metadata["inspection_backend"],
        "ffmpeg_path": ffmpeg,
        "ffprobe_path": ffprobe,
        "warnings": warnings,
    }
    artifact = workdir / "01_preprocessing.json"
    artifact.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
