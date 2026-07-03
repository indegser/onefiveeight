#!/usr/bin/env python3
"""Validate the top-level chord analysis JSON artifact."""

import argparse
import json
import sys
from pathlib import Path


REQUIRED_TOP_LEVEL = [
    "audio",
    "key",
    "tempo",
    "sections",
    "timestamped_chords",
    "simplified_chart",
    "advanced_chart",
    "ambiguities",
    "warnings",
]


def fail(message):
    print(f"ERROR: {message}", file=sys.stderr)
    return 1


def number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def validate(data):
    for key in REQUIRED_TOP_LEVEL:
        if key not in data:
            return fail(f"Missing top-level key: {key}")

    if not isinstance(data["timestamped_chords"], list):
        return fail("timestamped_chords must be a list")

    for index, chord in enumerate(data["timestamped_chords"]):
        if not isinstance(chord, dict):
            return fail(f"timestamped_chords[{index}] must be an object")
        for key in ["start", "end", "chord", "confidence"]:
            if key not in chord:
                return fail(f"timestamped_chords[{index}] missing {key}")
        if not number(chord["start"]) or not number(chord["end"]):
            return fail(f"timestamped_chords[{index}] start/end must be numbers")
        if chord["end"] <= chord["start"]:
            return fail(f"timestamped_chords[{index}] end must be greater than start")
        if not isinstance(chord["chord"], str) or not chord["chord"].strip():
            return fail(f"timestamped_chords[{index}] chord must be a non-empty string")
        if not number(chord["confidence"]) or not 0 <= chord["confidence"] <= 1:
            return fail(f"timestamped_chords[{index}] confidence must be between 0 and 1")

    for path in [("key", "confidence"), ("tempo", "confidence")]:
        obj = data.get(path[0], {})
        if path[1] in obj and (not number(obj[path[1]]) or not 0 <= obj[path[1]] <= 1):
            return fail(f"{'.'.join(path)} must be between 0 and 1")

    print("OK: analysis JSON is valid")
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("analysis_json", help="Path to 09_final_analysis.json")
    args = parser.parse_args()

    path = Path(args.analysis_json).expanduser().resolve()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return fail(f"Could not read JSON: {exc}")

    return validate(data)


if __name__ == "__main__":
    raise SystemExit(main())
