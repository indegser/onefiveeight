#!/usr/bin/env python3
"""Validate a final form-first audio-to-score JSON artifact."""

import argparse
import json
import re
import sys
from pathlib import Path


PITCH_RE = re.compile(r"^[A-G](?:#|b)?-?\d+$")
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
APPROVAL_STATUSES = {"pending", "approved", "rejected", "not_required"}
TIE_STATES = {"none", "start", "continue", "stop"}
FORM_EVENT_TYPES = {
    "repeat_start",
    "repeat_end",
    "first_ending",
    "second_ending",
    "ds",
    "dc",
    "segno",
    "coda",
    "fine",
    "meter_change",
}


class ValidationError(ValueError):
    """Raised when a score artifact violates a contract invariant."""


def require(condition, message):
    if not condition:
        raise ValidationError(message)


def is_number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def require_dict(value, path):
    require(isinstance(value, dict), f"{path} must be an object")
    return value


def require_list(value, path):
    require(isinstance(value, list), f"{path} must be a list")
    return value


def require_non_empty_string(value, path):
    require(isinstance(value, str) and value.strip(), f"{path} must be a non-empty string")
    return value


def require_confidence(value, path):
    require(is_number(value) and 0 <= value <= 1, f"{path} must be between 0 and 1")


def beats_from_signature(value, path):
    require_non_empty_string(value, path)
    match = re.fullmatch(r"(\d+)/(\d+)", value)
    require(match is not None, f"{path} must look like 4/4 or 6/8")
    numerator = int(match.group(1))
    denominator = int(match.group(2))
    require(numerator > 0 and denominator > 0, f"{path} must use positive values")
    return numerator


def validate_source(source):
    source = require_dict(source, "source")
    require_non_empty_string(source.get("audio_path"), "source.audio_path")
    require(
        is_number(source.get("duration_seconds")) and source["duration_seconds"] > 0,
        "source.duration_seconds must be positive",
    )
    require(
        isinstance(source.get("sha256"), str) and SHA256_RE.fullmatch(source["sha256"]),
        "source.sha256 must be 64 lowercase hexadecimal characters",
    )
    require(source.get("provenance") == "observed", "source.provenance must be observed")


def validate_form_events(events, valid_measure_ids, path, target_key="target_measure_id"):
    for index, event in enumerate(require_list(events, path)):
        event_path = f"{path}[{index}]"
        event = require_dict(event, event_path)
        require(event.get("type") in FORM_EVENT_TYPES, f"{event_path}.type is unsupported")
        measure_id = require_non_empty_string(event.get("measure_id"), f"{event_path}.measure_id")
        require(measure_id in valid_measure_ids, f"{event_path}.measure_id is unknown")
        if event["type"] in {"ds", "dc", "coda"}:
            require(target_key in event, f"{event_path}.{target_key} is required for {event['type']}")
        if target_key in event and event[target_key] is not None:
            require(
                event[target_key] in valid_measure_ids,
                f"{event_path}.{target_key} is unknown",
            )


def validate_form(form, source_duration):
    form = require_dict(form, "form")
    require(form.get("status") == "approved", "form.status must be approved")
    measures = require_list(form.get("measures"), "form.measures")
    require(measures, "form.measures must not be empty")

    measure_by_id = {}
    previous_end = None
    for offset, measure in enumerate(measures):
        path = f"form.measures[{offset}]"
        measure = require_dict(measure, path)
        measure_id = require_non_empty_string(measure.get("measure_id"), f"{path}.measure_id")
        require(measure_id not in measure_by_id, f"{path}.measure_id must be unique")
        require(measure.get("measure_index") == offset + 1, f"{path}.measure_index must be sequential")
        start = measure.get("source_start")
        end = measure.get("source_end")
        require(is_number(start) and start >= 0, f"{path}.source_start must be non-negative")
        require(is_number(end) and end > start, f"{path}.source_end must follow source_start")
        require(end <= source_duration + 0.05, f"{path}.source_end exceeds source duration")
        if previous_end is not None:
            require(start >= previous_end - 0.05, f"{path} overlaps the preceding measure")
        previous_end = end
        beats = measure.get("beats")
        expected_beats = beats_from_signature(measure.get("time_signature"), f"{path}.time_signature")
        require(is_number(beats) and beats > 0, f"{path}.beats must be positive")
        if not measure.get("is_pickup", False):
            require(
                abs(beats - expected_beats) < 0.01,
                f"{path}.beats must match its time signature unless it is a pickup",
            )
        require(isinstance(measure.get("is_pickup"), bool), f"{path}.is_pickup must be boolean")
        for field in ["section_id", "recurrence_group"]:
            require_non_empty_string(measure.get(field), f"{path}.{field}")
        require(
            isinstance(measure.get("occurrence"), int) and measure["occurrence"] > 0,
            f"{path}.occurrence must be a positive integer",
        )
        require(
            isinstance(measure.get("bar_in_section"), int) and measure["bar_in_section"] > 0,
            f"{path}.bar_in_section must be a positive integer",
        )
        require_confidence(measure.get("confidence"), f"{path}.confidence")
        require_list(measure.get("evidence_refs"), f"{path}.evidence_refs")
        measure_by_id[measure_id] = measure

    sections = require_list(form.get("sections"), "form.sections")
    require(sections, "form.sections must not be empty")
    section_by_id = {}
    measure_index_by_id = {
        measure_id: measure["measure_index"] for measure_id, measure in measure_by_id.items()
    }
    for index, section in enumerate(sections):
        path = f"form.sections[{index}]"
        section = require_dict(section, path)
        section_id = require_non_empty_string(section.get("section_id"), f"{path}.section_id")
        require(section_id not in section_by_id, f"{path}.section_id must be unique")
        require_non_empty_string(section.get("neutral_label"), f"{path}.neutral_label")
        require_non_empty_string(section.get("recurrence_group"), f"{path}.recurrence_group")
        require(
            isinstance(section.get("occurrence"), int) and section["occurrence"] > 0,
            f"{path}.occurrence must be a positive integer",
        )
        start_id = section.get("start_measure_id")
        end_id = section.get("end_measure_id")
        require(start_id in measure_by_id, f"{path}.start_measure_id is unknown")
        require(end_id in measure_by_id, f"{path}.end_measure_id is unknown")
        require(
            measure_index_by_id[start_id] <= measure_index_by_id[end_id],
            f"{path} has an inverted measure range",
        )
        require_confidence(section.get("boundary_confidence"), f"{path}.boundary_confidence")
        label = section.get("semantic_label")
        if label is not None:
            require_non_empty_string(label, f"{path}.semantic_label")
            require(
                section.get("label_status") in {"evidenced", "inferred"},
                f"{path}.label_status must be evidenced or inferred",
            )
            require_confidence(section.get("label_confidence"), f"{path}.label_confidence")
            require(section.get("evidence_refs"), f"{path} semantic label requires evidence_refs")
        require_list(section.get("evidence_refs"), f"{path}.evidence_refs")
        section_by_id[section_id] = section

    for measure_id, measure in measure_by_id.items():
        section = section_by_id.get(measure["section_id"])
        require(section is not None, f"form measure {measure_id} references an unknown section")
        require(
            section["recurrence_group"] == measure["recurrence_group"],
            f"form measure {measure_id} recurrence_group differs from its section",
        )
        require(
            section["occurrence"] == measure["occurrence"],
            f"form measure {measure_id} occurrence differs from its section",
        )
        require(
            measure_index_by_id[section["start_measure_id"]]
            <= measure["measure_index"]
            <= measure_index_by_id[section["end_measure_id"]],
            f"form measure {measure_id} falls outside its section range",
        )

    for section_id, section in section_by_id.items():
        section_measures = [
            measure
            for measure in measures
            if measure["section_id"] == section_id
        ]
        require(section_measures, f"form section {section_id} contains no measures")
        require(
            section_measures[0]["measure_id"] == section["start_measure_id"]
            and section_measures[-1]["measure_id"] == section["end_measure_id"],
            f"form section {section_id} range does not match its assigned measures",
        )
        require(
            [measure["bar_in_section"] for measure in section_measures]
            == list(range(1, len(section_measures) + 1)),
            f"form section {section_id} bar_in_section values must be continuous",
        )

    validate_form_events(form.get("form_events", []), set(measure_by_id), "form.form_events")
    require_list(form.get("rejected_hypotheses", []), "form.rejected_hypotheses")
    require_list(form.get("warnings", []), "form.warnings")
    return measure_by_id


def validate_timed_event(event, path, beats):
    event = require_dict(event, path)
    onset = event.get("onset_beat")
    duration = event.get("duration_beats")
    require(is_number(onset) and onset >= 1, f"{path}.onset_beat must be at least 1")
    require(is_number(duration) and duration > 0, f"{path}.duration_beats must be positive")
    require(onset + duration - 1 <= beats + 0.01, f"{path} exceeds the measure")
    return event, onset, onset + duration


def validate_melody_events(events, path, beats):
    previous_end = None
    event_ids = set()
    for index, raw_event in enumerate(require_list(events, path)):
        event_path = f"{path}[{index}]"
        event, onset, end = validate_timed_event(raw_event, event_path, beats)
        event_id = require_non_empty_string(event.get("event_id"), f"{event_path}.event_id")
        require(event_id not in event_ids, f"{event_path}.event_id must be unique in its measure")
        event_ids.add(event_id)
        require(event.get("type") in {"note", "rest"}, f"{event_path}.type must be note or rest")
        if previous_end is not None:
            require(onset >= previous_end - 0.01, f"{event_path} overlaps the previous melody event")
        previous_end = end
        if event["type"] == "note":
            require(
                isinstance(event.get("pitch"), str) and PITCH_RE.fullmatch(event["pitch"]),
                f"{event_path}.pitch must use scientific pitch notation",
            )
            if event.get("sounding_pitch") is not None:
                require(
                    isinstance(event["sounding_pitch"], str)
                    and PITCH_RE.fullmatch(event["sounding_pitch"]),
                    f"{event_path}.sounding_pitch must use scientific pitch notation",
                )
            lyric = event.get("lyric")
            if lyric is not None:
                lyric = require_dict(lyric, f"{event_path}.lyric")
                require_non_empty_string(lyric.get("text"), f"{event_path}.lyric.text")
                require(
                    lyric.get("syllabic") in {"single", "begin", "middle", "end"},
                    f"{event_path}.lyric.syllabic is invalid",
                )
                require_confidence(lyric.get("confidence"), f"{event_path}.lyric.confidence")
        else:
            require("pitch" not in event, f"{event_path} rest must not contain pitch")
            require("lyric" not in event, f"{event_path} rest must not contain lyric")
        if event.get("ornament") is not None:
            require_non_empty_string(event["ornament"], f"{event_path}.ornament")
        has_source_start = "source_start" in event
        has_source_end = "source_end" in event
        require(
            has_source_start == has_source_end,
            f"{event_path} source_start and source_end must appear together",
        )
        if has_source_start:
            require(
                is_number(event["source_start"]) and event["source_start"] >= 0,
                f"{event_path}.source_start must be non-negative",
            )
            require(
                is_number(event["source_end"]) and event["source_end"] > event["source_start"],
                f"{event_path}.source_end must follow source_start",
            )
        require(event.get("tie", "none") in TIE_STATES, f"{event_path}.tie is invalid")
        require_confidence(event.get("confidence"), f"{event_path}.confidence")
        alternatives = require_list(event.get("alternatives", []), f"{event_path}.alternatives")
        require(
            all(isinstance(alternative, str) and alternative.strip() for alternative in alternatives),
            f"{event_path}.alternatives must contain non-empty strings",
        )
        source_refs = require_list(event.get("source_refs"), f"{event_path}.source_refs")
        require(
            all(isinstance(reference, str) and reference.strip() for reference in source_refs),
            f"{event_path}.source_refs must contain non-empty strings",
        )


def validate_harmony_events(events, path, beats, form_measure):
    for index, raw_event in enumerate(require_list(events, path)):
        event_path = f"{path}[{index}]"
        event, _, _ = validate_timed_event(raw_event, event_path, beats)
        require_non_empty_string(event.get("event_id"), f"{event_path}.event_id")
        chord = event.get("chord")
        require(chord is None or (isinstance(chord, str) and chord.strip()), f"{event_path}.chord is invalid")
        require_confidence(event.get("confidence"), f"{event_path}.confidence")
        require_list(event.get("alternatives", []), f"{event_path}.alternatives")
        require_list(event.get("source_refs"), f"{event_path}.source_refs")
        position = require_dict(event.get("form_position"), f"{event_path}.form_position")
        for key in ["section_id", "occurrence", "recurrence_group", "bar_in_section"]:
            require(
                position.get(key) == form_measure.get(key),
                f"{event_path}.form_position.{key} differs from the approved form",
            )


def validate_transcription(transcription, form_measures):
    transcription = require_dict(transcription, "transcription")
    require(
        transcription.get("provenance") == "adjudicated",
        "transcription.provenance must be adjudicated",
    )
    linear_measures = require_list(
        transcription.get("linear_measures"), "transcription.linear_measures"
    )
    require(
        len(linear_measures) == len(form_measures),
        "transcription.linear_measures must match the approved form measure count",
    )
    for index, measure in enumerate(linear_measures):
        path = f"transcription.linear_measures[{index}]"
        measure = require_dict(measure, path)
        measure_id = measure.get("measure_id")
        require(measure_id in form_measures, f"{path}.measure_id is unknown")
        form_measure = form_measures[measure_id]
        require(
            form_measure["measure_index"] == index + 1,
            f"{path} is out of linear performance order",
        )
        require(
            measure.get("measure_index") == form_measure["measure_index"],
            f"{path}.measure_index differs from the approved form",
        )
        for key in [
            "section_id",
            "occurrence",
            "recurrence_group",
            "bar_in_section",
            "time_signature",
            "beats",
        ]:
            require(measure.get(key) == form_measure.get(key), f"{path}.{key} differs from form")
        beats = form_measure["beats"]
        validate_melody_events(measure.get("melody_events"), f"{path}.melody_events", beats)
        validate_harmony_events(
            measure.get("harmony_events"), f"{path}.harmony_events", beats, form_measure
        )
        require_list(measure.get("bass_events", []), f"{path}.bass_events")
    return linear_measures


def validate_arrangement(arrangement, approvals, form_measures):
    arrangement = require_dict(arrangement, "arrangement")
    status = arrangement.get("status")
    require(status in {"omitted", "approved"}, "arrangement.status must be omitted or approved")
    layers = require_list(arrangement.get("layers"), "arrangement.layers")
    if status == "omitted":
        require(not layers, "an omitted arrangement must not contain layers")
        require(
            approvals["arrangement"]["status"] == "not_required",
            "omitted arrangement requires arrangement approval status not_required",
        )
        return
    require(
        arrangement.get("provenance") == "generated",
        "arrangement.provenance must be generated",
    )
    require_non_empty_string(arrangement.get("instrument"), "arrangement.instrument")
    require_non_empty_string(arrangement.get("difficulty"), "arrangement.difficulty")
    require(layers, "approved arrangement must contain layers")
    require(
        approvals["arrangement"]["status"] == "approved",
        "approved arrangement requires arrangement approval",
    )
    for layer_index, layer in enumerate(layers):
        path = f"arrangement.layers[{layer_index}]"
        layer = require_dict(layer, path)
        require_non_empty_string(layer.get("layer_id"), f"{path}.layer_id")
        require(layer.get("provenance") == "generated", f"{path}.provenance must be generated")
        for measure_index, measure in enumerate(require_list(layer.get("measures"), f"{path}.measures")):
            measure_path = f"{path}.measures[{measure_index}]"
            measure = require_dict(measure, measure_path)
            measure_id = measure.get("measure_id")
            require(measure_id in form_measures, f"{measure_path}.measure_id is unknown")
            beats = form_measures[measure_id]["beats"]
            for event_index, raw_event in enumerate(
                require_list(measure.get("events"), f"{measure_path}.events")
            ):
                event_path = f"{measure_path}.events[{event_index}]"
                event, _, _ = validate_timed_event(raw_event, event_path, beats)
                require_non_empty_string(event.get("event_id"), f"{event_path}.event_id")
                pitches = require_list(event.get("pitches"), f"{event_path}.pitches")
                require(pitches, f"{event_path}.pitches must not be empty")
                require(
                    all(isinstance(pitch, str) and PITCH_RE.fullmatch(pitch) for pitch in pitches),
                    f"{event_path}.pitches must use scientific pitch notation",
                )
                require(
                    "source_refs" not in event,
                    f"{event_path} generated event must not claim source_refs",
                )
                require_list(event.get("derived_from_refs"), f"{event_path}.derived_from_refs")


def validate_written_score(written_score, form_measures):
    written_score = require_dict(written_score, "written_score")
    require(written_score.get("status") == "ready", "written_score.status must be ready")
    written_measures = require_list(
        written_score.get("written_measures"), "written_score.written_measures"
    )
    require(written_measures, "written_score.written_measures must not be empty")
    written_ids = set()
    for index, measure in enumerate(written_measures):
        path = f"written_score.written_measures[{index}]"
        measure = require_dict(measure, path)
        written_id = require_non_empty_string(
            measure.get("written_measure_id"), f"{path}.written_measure_id"
        )
        require(written_id not in written_ids, f"{path}.written_measure_id must be unique")
        written_ids.add(written_id)
        beats_from_signature(measure.get("time_signature"), f"{path}.time_signature")

    seen_linear = set()
    mappings = require_list(
        written_score.get("linear_to_written"), "written_score.linear_to_written"
    )
    for index, mapping in enumerate(mappings):
        path = f"written_score.linear_to_written[{index}]"
        mapping = require_dict(mapping, path)
        linear_id = mapping.get("linear_measure_id")
        written_id = mapping.get("written_measure_id")
        require(linear_id in form_measures, f"{path}.linear_measure_id is unknown")
        require(linear_id not in seen_linear, f"{path}.linear_measure_id is duplicated")
        seen_linear.add(linear_id)
        require(written_id in written_ids, f"{path}.written_measure_id is unknown")
        require(
            isinstance(mapping.get("pass"), int) and mapping["pass"] > 0,
            f"{path}.pass must be a positive integer",
        )
    require(
        seen_linear == set(form_measures),
        "written_score.linear_to_written must map every linear measure exactly once",
    )
    validate_form_events(
        written_score.get("form_events", []),
        written_ids,
        "written_score.form_events",
        target_key="target_measure_id",
    )


def validate_approvals(approvals):
    approvals = require_dict(approvals, "approvals")
    result = {}
    for key in ["form", "transcription", "arrangement"]:
        path = f"approvals.{key}"
        approval = require_dict(approvals.get(key), path)
        require(approval.get("status") in APPROVAL_STATUSES, f"{path}.status is invalid")
        require_list(approval.get("notes"), f"{path}.notes")
        if approval["status"] == "approved":
            require_non_empty_string(approval.get("reviewed_by"), f"{path}.reviewed_by")
        result[key] = approval
    require(result["form"]["status"] == "approved", "approvals.form must be approved")
    require(
        result["transcription"]["status"] == "approved",
        "approvals.transcription must be approved",
    )
    return result


def validate(data):
    data = require_dict(data, "root")
    require(data.get("schema_version") == "1.0", "schema_version must be 1.0")
    validate_source(data.get("source"))
    evidence = require_dict(data.get("evidence"), "evidence")
    require_list(evidence.get("artifact_refs"), "evidence.artifact_refs")
    require_list(evidence.get("warnings"), "evidence.warnings")
    approvals = validate_approvals(data.get("approvals"))
    form_measures = validate_form(data.get("form"), data["source"]["duration_seconds"])
    validate_transcription(data.get("transcription"), form_measures)
    validate_arrangement(data.get("arrangement"), approvals, form_measures)
    validate_written_score(data.get("written_score"), form_measures)
    require_list(data.get("uncertainty"), "uncertainty")
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("score_json", help="Path to 11_final_score.json")
    args = parser.parse_args()
    path = Path(args.score_json).expanduser().resolve()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        validate(data)
    except (OSError, json.JSONDecodeError, ValidationError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    print("OK: final audio-to-score artifact is valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
