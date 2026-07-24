#!/usr/bin/env python3
"""Unit tests for validate_evidence.py."""

import unittest

from validate_evidence import EvidenceValidationError, validate


def evidence():
    return {
        "artifact_type": "harmony_evidence",
        "artifact_version": "1.0",
        "role": "measurement_only",
        "status": "evidence_ready",
        "do_not_select_automatically": True,
        "audio": {"path": "song.wav", "duration_seconds": 2},
        "sources": [{"role": "full_mix", "path": "song.wav"}],
        "tempo_hypotheses": [
            {
                "hypothesis_id": "tempo-half",
                "bpm": 70,
                "evidence_support": 0.7,
                "requires_agent_selection": True,
            },
            {
                "hypothesis_id": "tempo-double",
                "bpm": 140,
                "evidence_support": 0.7,
                "requires_agent_selection": True,
            },
        ],
        "beat_grid_hypotheses": [
            {"grid_id": "grid-half", "requires_agent_selection": True}
        ],
        "key_hypotheses": [
            {"key": "Eb major", "evidence_support": 0.8},
            {"key": "C minor", "evidence_support": 0.75},
        ],
        "segments": [
            {
                "segment_id": "seg-1",
                "start": 0,
                "end": 2,
                "chroma_by_source": {},
                "bass_candidates": [],
                "warnings": [],
            }
        ],
        "recurrence_candidates": [],
        "warnings": [],
    }


def candidates():
    return {
        "artifact_type": "chord_candidates",
        "artifact_version": "1.0",
        "role": "measurement_only",
        "do_not_select_automatically": True,
        "score_semantics": "evidence_support ranks template fit only; it is not decision confidence",
        "segments": [
            {
                "segment_id": "seg-1",
                "do_not_select_automatically": True,
                "candidates": [
                    {"chord": "Eb", "evidence_support": 0.8},
                    {"chord": "Cm7", "evidence_support": 0.7},
                ],
            }
        ],
        "warnings": [],
    }


class ValidateEvidenceTests(unittest.TestCase):
    def test_accepts_evidence(self):
        self.assertTrue(validate(evidence()))

    def test_accepts_candidates(self):
        self.assertTrue(validate(candidates()))

    def test_rejects_authoritative_candidate(self):
        data = candidates()
        data["segments"][0]["chosen_chord"] = "Eb"
        with self.assertRaises(EvidenceValidationError):
            validate(data)

    def test_rejects_single_tempo_hypothesis(self):
        data = evidence()
        data["tempo_hypotheses"] = data["tempo_hypotheses"][:1]
        with self.assertRaises(EvidenceValidationError):
            validate(data)

    def test_accepts_partial_evidence_with_single_tempo_hypothesis(self):
        data = evidence()
        data["status"] = "partial_evidence"
        data["tempo_hypotheses"] = data["tempo_hypotheses"][:1]
        self.assertTrue(validate(data))

    def test_rejects_confidence_in_candidate(self):
        data = candidates()
        data["segments"][0]["candidates"][0]["confidence"] = 0.8
        with self.assertRaises(EvidenceValidationError):
            validate(data)


if __name__ == "__main__":
    unittest.main()
