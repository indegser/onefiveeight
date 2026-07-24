#!/usr/bin/env python3
"""Validate non-authoritative harmony evidence and chord candidate artifacts."""

import argparse
import json
import sys
from pathlib import Path


FORBIDDEN_DECISION_FIELDS = {
    "chosen_chord",
    "selected_chord",
    "confidence",
    "decision_confidence",
    "final_chord",
    "final_form",
    "selected_tempo",
    "selected_grid",
}


class EvidenceValidationError(ValueError):
    """Raised when measurement artifacts cross into musical adjudication."""


def require(condition, message):
    if not condition:
        raise EvidenceValidationError(message)


def number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def support(value):
    return number(value) and 0 <= value <= 1


def reject_decision_fields(value, path="root"):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in FORBIDDEN_DECISION_FIELDS:
                raise EvidenceValidationError(
                    f"{path}.{key} is a final-decision field and is forbidden in evidence"
                )
            reject_decision_fields(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            reject_decision_fields(child, f"{path}[{index}]")


def validate_common(data, artifact_type):
    require(isinstance(data, dict), "artifact root must be an object")
    require(data.get("artifact_type") == artifact_type, f"artifact_type must be {artifact_type}")
    require(data.get("role") == "measurement_only", "role must be measurement_only")
    require(
        data.get("do_not_select_automatically") is True,
        "do_not_select_automatically must be true",
    )
    require(isinstance(data.get("segments"), list), "segments must be a list")
    require(isinstance(data.get("warnings", []), list), "warnings must be a list")
    reject_decision_fields(data)


def validate_harmony_evidence(data):
    validate_common(data, "harmony_evidence")
    require(
        data.get("status") in {"evidence_ready", "partial_evidence"},
        "status must be evidence_ready or partial_evidence",
    )
    require(isinstance(data.get("audio"), dict), "audio must be an object")
    require(isinstance(data.get("sources"), list) and data["sources"], "sources must not be empty")
    tempo_hypotheses = data.get("tempo_hypotheses")
    require(isinstance(tempo_hypotheses, list), "tempo_hypotheses must be a list")
    if data.get("status") == "evidence_ready":
        require(
            len(tempo_hypotheses) >= 2,
            "evidence_ready artifacts must preserve at least two tempo hypotheses",
        )
        require(
            len(data.get("beat_grid_hypotheses", [])) >= 1,
            "evidence_ready artifacts require a beat-grid hypothesis",
        )
        require(
            len(data["segments"]) >= 1,
            "evidence_ready artifacts require measured segments",
        )
    for index, hypothesis in enumerate(tempo_hypotheses):
        path = f"tempo_hypotheses[{index}]"
        require(hypothesis.get("requires_agent_selection") is True, f"{path} requires agent selection")
        require(number(hypothesis.get("bpm")) and hypothesis["bpm"] > 0, f"{path}.bpm must be positive")
        require(support(hypothesis.get("evidence_support")), f"{path}.evidence_support is invalid")
    for index, grid in enumerate(data.get("beat_grid_hypotheses", [])):
        require(
            grid.get("requires_agent_selection") is True,
            f"beat_grid_hypotheses[{index}] requires agent selection",
        )
    key_hypotheses = data.get("key_hypotheses")
    require(isinstance(key_hypotheses, list) and len(key_hypotheses) >= 2, "preserve multiple key hypotheses")
    for index, hypothesis in enumerate(key_hypotheses):
        require(
            support(hypothesis.get("evidence_support")),
            f"key_hypotheses[{index}].evidence_support is invalid",
        )
    recurrence = data.get("recurrence_candidates", [])
    require(isinstance(recurrence, list), "recurrence_candidates must be a list")
    for index, item in enumerate(recurrence):
        path = f"recurrence_candidates[{index}]"
        require(
            item.get("requires_agent_interpretation") is True,
            f"{path} requires agent interpretation",
        )
        require(isinstance(item.get("peers"), list), f"{path}.peers must be a list")
        for peer_index, peer in enumerate(item["peers"]):
            require(
                support(peer.get("similarity_support")),
                f"{path}.peers[{peer_index}].similarity_support is invalid",
            )
    return True


def validate_chord_candidates(data):
    validate_common(data, "chord_candidates")
    semantics = str(data.get("score_semantics", "")).lower()
    require(
        "evidence_support" in semantics
        and (
            "not decision confidence" in semantics
            or "distinct from decision confidence" in semantics
        ),
        "score semantics must distinguish evidence support from decision confidence",
    )
    for index, segment in enumerate(data["segments"]):
        path = f"segments[{index}]"
        require(segment.get("do_not_select_automatically") is True, f"{path} must forbid automatic selection")
        candidates = segment.get("candidates")
        require(isinstance(candidates, list) and len(candidates) >= 2, f"{path} must preserve at least two candidates")
        for candidate_index, candidate in enumerate(candidates):
            candidate_path = f"{path}.candidates[{candidate_index}]"
            require(
                isinstance(candidate.get("chord"), str) and candidate["chord"].strip(),
                f"{candidate_path}.chord must be a non-empty string",
            )
            require(
                support(candidate.get("evidence_support")),
                f"{candidate_path}.evidence_support is invalid",
            )
            require("confidence" not in candidate, f"{candidate_path} must not use confidence")
    return True


def validate(data):
    artifact_type = data.get("artifact_type") if isinstance(data, dict) else None
    if artifact_type == "harmony_evidence":
        return validate_harmony_evidence(data)
    if artifact_type == "chord_candidates":
        return validate_chord_candidates(data)
    raise EvidenceValidationError(f"unsupported artifact_type: {artifact_type}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact_json", help="Evidence or candidate artifact")
    args = parser.parse_args()
    path = Path(args.artifact_json).expanduser().resolve()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        validate(data)
    except (OSError, json.JSONDecodeError, EvidenceValidationError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    print(f"OK: {data['artifact_type']} is valid non-authoritative evidence")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
