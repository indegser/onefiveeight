#!/usr/bin/env python3
"""Validate audio with ffprobe and optionally create a WAV working copy."""

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path


def run_json(cmd):
    result = subprocess.run(cmd, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", help="Input audio file")
    parser.add_argument("--workdir", required=True, help="Directory for output artifacts")
    parser.add_argument("--sample-rate", type=int, default=44100)
    parser.add_argument("--channels", type=int, default=2)
    parser.add_argument("--no-convert", action="store_true", help="Only inspect metadata")
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    workdir = Path(args.workdir).expanduser().resolve()
    workdir.mkdir(parents=True, exist_ok=True)

    if not input_path.exists():
        print(json.dumps({"error": f"Input does not exist: {input_path}"}), file=sys.stderr)
        return 2

    if shutil.which("ffprobe") is None:
        print(json.dumps({"error": "ffprobe is not available on PATH"}), file=sys.stderr)
        return 2

    probe = run_json(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration:stream=codec_type,sample_rate,channels",
            "-of",
            "json",
            str(input_path),
        ]
    )

    audio_streams = [s for s in probe.get("streams", []) if s.get("codec_type") == "audio"]
    warnings = []
    if not audio_streams:
        print(json.dumps({"error": "No audio stream found"}), file=sys.stderr)
        return 3

    stream = audio_streams[0]
    duration = float(probe.get("format", {}).get("duration") or 0)
    sample_rate = int(stream.get("sample_rate") or 0)
    channels = int(stream.get("channels") or 0)
    audio_path = input_path

    if not args.no_convert:
        if shutil.which("ffmpeg") is None:
            warnings.append("ffmpeg is not available; using original audio path")
        else:
            output_path = workdir / f"{input_path.stem}.analysis.wav"
            subprocess.run(
                [
                    "ffmpeg",
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
            )
            audio_path = output_path
            sample_rate = args.sample_rate
            channels = args.channels

    payload = {
        "audio_path": str(audio_path),
        "duration_seconds": duration,
        "sample_rate": sample_rate,
        "channels": channels,
        "warnings": warnings,
    }
    artifact = workdir / "01_preprocessing.json"
    artifact.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
