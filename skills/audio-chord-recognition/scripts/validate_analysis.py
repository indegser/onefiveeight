#!/usr/bin/env python3
"""Validate standalone or audio-to-score-module chord analysis JSON."""

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

MODULE_EVENT_FIELDS = [
    "event_id",
    "measure_id",
    "onset_beat",
    "duration_beats",
    "section_id",
    "occurrence",
    "recurrence_group",
    "bar_in_section",
    "alternatives",
    "evidence_refs",
    "consensus_action",
]


class ValidationError(ValueError):
    """Raised when a chord artifact violates its contract."""


def require(condition, message):
    if not condition:
        raise ValidationError(message)


def number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def confidence(value):
    return number(value) and 0 <= value <= 1


def validate_module_context(data):
    form_context = data.get("form_context")
    require(isinstance(form_context, dict), "module mode requires form_context")
    require(form_context.get("status") == "approved", "module form_context must be approved")
    require(
        isinstance(form_context.get("source_artifact"), str)
        and form_context["source_artifact"].strip(),
        "module form_context requires source_artifact",
    )
    require(
        isinstance(data.get("form_change_requests", []), list),
        "form_change_requests must be a list",
    )


def validate_timestamped_chords(data, mode):
    chords = data["timestamped_chords"]
    require(isinstance(chords, list), "timestamped_chords must be a list")
    previous_start = None
    for index, chord in enumerate(chords):
        path = f"timestamped_chords[{index}]"
        require(isinstance(chord, dict), f"{path} must be an object")
        for key in ["start", "end", "chord", "confidence"]:
            require(key in chord, f"{path} missing {key}")
        require(number(chord["start"]) and number(chord["end"]), f"{path} start/end must be numbers")
        require(chord["end"] > chord["start"], f"{path} end must be greater than start")
        if previous_start is not None:
            require(chord["start"] >= previous_start, f"{path} must not move backward in time")
        previous_start = chord["start"]
        if mode == "audio_to_score_module":
            require(
                chord["chord"] is None
                or (isinstance(chord["chord"], str) and chord["chord"].strip()),
                f"{path} chord must be a non-empty string or null",
            )
        else:
            require(
                isinstance(chord["chord"], str) and chord["chord"].strip(),
                f"{path} chord must be a non-empty string",
            )
        require(confidence(chord["confidence"]), f"{path} confidence must be between 0 and 1")
        if chord.get("provenance") == "generated":
            raise ValidationError(f"{path} must not contain generated accompaniment harmony")

        if mode == "audio_to_score_module":
            for key in MODULE_EVENT_FIELDS:
                require(key in chord, f"{path} missing module field {key}")
            for key in ["event_id", "measure_id", "section_id", "recurrence_group"]:
                require(
                    isinstance(chord[key], str) and chord[key].strip(),
                    f"{path}.{key} must be a non-empty string",
                )
            for key in ["occurrence", "bar_in_section"]:
                require(
                    isinstance(chord[key], int) and chord[key] > 0,
                    f"{path}.{key} must be a positive integer",
                )
            require(
                number(chord["onset_beat"]) and chord["onset_beat"] >= 1,
                f"{path}.onset_beat must be at least 1",
            )
            require(
                number(chord["duration_beats"]) and chord["duration_beats"] > 0,
                f"{path}.duration_beats must be positive",
            )
            require(isinstance(chord["alternatives"], list), f"{path}.alternatives must be a list")
            require(isinstance(chord["evidence_refs"], list), f"{path}.evidence_refs must be a list")
            require(
                chord["consensus_action"] in {"kept", "revised", "variation", "unresolved"},
                f"{path}.consensus_action is invalid",
            )


def validate(data):
    require(isinstance(data, dict), "analysis root must be an object")
    for key in REQUIRED_TOP_LEVEL:
        require(key in data, f"missing top-level key: {key}")

    mode = data.get("mode", "standalone")
    require(mode in {"standalone", "audio_to_score_module"}, "mode is invalid")

    for key in ["sections", "simplified_chart", "advanced_chart", "ambiguities", "warnings"]:
        require(isinstance(data[key], list), f"{key} must be a list")
    if "measure_chart" in data:
        require(isinstance(data["measure_chart"], list), "measure_chart must be a list")

    for path in [("key", "confidence"), ("tempo", "confidence")]:
        obj = data.get(path[0], {})
        require(isinstance(obj, dict), f"{path[0]} must be an object")
        if path[1] in obj:
            require(confidence(obj[path[1]]), f"{'.'.join(path)} must be between 0 and 1")

    if mode == "audio_to_score_module":
        validate_module_context(data)
    validate_timestamped_chords(data, mode)
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("analysis_json", help="Path to the final harmony analysis JSON")
    args = parser.parse_args()
    path = Path(args.analysis_json).expanduser().resolve()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        validate(data)
    except (OSError, json.JSONDecodeError, ValidationError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    print("OK: chord analysis JSON is valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
