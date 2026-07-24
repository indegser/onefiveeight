#!/usr/bin/env python3
"""Unit tests for validate_score.py."""

import copy
import unittest

from validate_score import ValidationError, validate


def valid_score():
    form_measure = {
        "measure_id": "m1",
        "measure_index": 1,
        "source_start": 0.0,
        "source_end": 2.0,
        "time_signature": "4/4",
        "beats": 4,
        "is_pickup": False,
        "section_id": "sec-a-1",
        "occurrence": 1,
        "recurrence_group": "rg-a",
        "bar_in_section": 1,
        "confidence": 0.9,
        "evidence_refs": ["ev-downbeat-1"],
    }
    return {
        "schema_version": "1.0",
        "source": {
            "audio_path": "song.wav",
            "duration_seconds": 2.0,
            "sha256": "a" * 64,
            "provenance": "observed",
        },
        "evidence": {"artifact_refs": ["02_evidence.json"], "warnings": []},
        "form": {
            "status": "approved",
            "measures": [form_measure],
            "sections": [
                {
                    "section_id": "sec-a-1",
                    "neutral_label": "A",
                    "semantic_label": "Verse",
                    "label_status": "inferred",
                    "occurrence": 1,
                    "recurrence_group": "rg-a",
                    "start_measure_id": "m1",
                    "end_measure_id": "m1",
                    "boundary_confidence": 0.9,
                    "label_confidence": 0.7,
                    "evidence_refs": ["ev-downbeat-1"],
                }
            ],
            "form_events": [],
            "rejected_hypotheses": [],
            "warnings": [],
        },
        "transcription": {
            "provenance": "adjudicated",
            "linear_measures": [
                {
                    "measure_id": "m1",
                    "measure_index": 1,
                    "time_signature": "4/4",
                    "beats": 4,
                    "section_id": "sec-a-1",
                    "occurrence": 1,
                    "recurrence_group": "rg-a",
                    "bar_in_section": 1,
                    "melody_events": [
                        {
                            "event_id": "mel-1",
                            "type": "note",
                            "onset_beat": 1,
                            "duration_beats": 2,
                            "pitch": "Eb4",
                            "tie": "none",
                            "confidence": 0.8,
                            "alternatives": [],
                            "source_refs": ["ev-f0-1"],
                        },
                        {
                            "event_id": "mel-2",
                            "type": "rest",
                            "onset_beat": 3,
                            "duration_beats": 2,
                            "tie": "none",
                            "confidence": 0.9,
                            "alternatives": [],
                            "source_refs": ["ev-voicing-1"],
                        },
                    ],
                    "harmony_events": [
                        {
                            "event_id": "harm-1",
                            "onset_beat": 1,
                            "duration_beats": 4,
                            "chord": "Ebmaj7",
                            "confidence": 0.8,
                            "alternatives": ["Eb"],
                            "source_refs": ["ev-chroma-1"],
                            "form_position": {
                                "section_id": "sec-a-1",
                                "occurrence": 1,
                                "recurrence_group": "rg-a",
                                "bar_in_section": 1,
                            },
                        }
                    ],
                    "bass_events": [],
                }
            ],
        },
        "arrangement": {"status": "omitted", "layers": []},
        "written_score": {
            "status": "ready",
            "written_measures": [
                {"written_measure_id": "w1", "time_signature": "4/4"}
            ],
            "linear_to_written": [
                {
                    "linear_measure_id": "m1",
                    "written_measure_id": "w1",
                    "pass": 1,
                }
            ],
            "form_events": [],
        },
        "approvals": {
            "form": {"status": "approved", "reviewed_by": "reviewer", "notes": []},
            "transcription": {
                "status": "approved",
                "reviewed_by": "reviewer",
                "notes": [],
            },
            "arrangement": {
                "status": "not_required",
                "reviewed_by": None,
                "notes": [],
            },
        },
        "uncertainty": [],
    }


class ValidateScoreTests(unittest.TestCase):
    def test_valid_score(self):
        self.assertTrue(validate(valid_score()))

    def test_rejects_unapproved_form(self):
        score = valid_score()
        score["approvals"]["form"]["status"] = "pending"
        with self.assertRaises(ValidationError):
            validate(score)

    def test_rejects_overlapping_melody(self):
        score = valid_score()
        score["transcription"]["linear_measures"][0]["melody_events"][1][
            "onset_beat"
        ] = 2
        with self.assertRaises(ValidationError):
            validate(score)

    def test_rejects_harmony_outside_form_context(self):
        score = valid_score()
        score["transcription"]["linear_measures"][0]["harmony_events"][0][
            "form_position"
        ]["bar_in_section"] = 2
        with self.assertRaises(ValidationError):
            validate(score)

    def test_rejects_generated_source_layer(self):
        score = valid_score()
        score["source"]["provenance"] = "generated"
        with self.assertRaises(ValidationError):
            validate(score)

    def test_rejects_missing_written_mapping(self):
        score = valid_score()
        score["written_score"]["linear_to_written"] = []
        with self.assertRaises(ValidationError):
            validate(score)

    def test_rejects_section_range_that_disagrees_with_measure_membership(self):
        score = valid_score()
        score["form"]["sections"][0]["start_measure_id"] = "unknown"
        with self.assertRaises(ValidationError):
            validate(score)

    def test_rejects_approved_gate_without_reviewer(self):
        score = valid_score()
        score["approvals"]["transcription"]["reviewed_by"] = None
        with self.assertRaises(ValidationError):
            validate(score)

    def test_rejects_invalid_lyric_structure(self):
        score = valid_score()
        score["transcription"]["linear_measures"][0]["melody_events"][0]["lyric"] = {
            "text": "word",
            "syllabic": "invalid",
            "confidence": 0.8,
        }
        with self.assertRaises(ValidationError):
            validate(score)

    def test_accepts_generated_arrangement_with_separate_provenance(self):
        score = valid_score()
        score["arrangement"] = {
            "status": "approved",
            "provenance": "generated",
            "instrument": "piano",
            "difficulty": "intermediate",
            "layers": [
                {
                    "layer_id": "piano-rh",
                    "provenance": "generated",
                    "measures": [
                        {
                            "measure_id": "m1",
                            "events": [
                                {
                                    "event_id": "arr-1",
                                    "onset_beat": 1,
                                    "duration_beats": 4,
                                    "pitches": ["Eb3", "Bb3", "D4"],
                                    "derived_from_refs": ["harm-1"],
                                }
                            ],
                        }
                    ],
                }
            ],
        }
        score["approvals"]["arrangement"] = {
            "status": "approved",
            "reviewed_by": "reviewer",
            "notes": [],
        }
        self.assertTrue(validate(score))


if __name__ == "__main__":
    unittest.main()
