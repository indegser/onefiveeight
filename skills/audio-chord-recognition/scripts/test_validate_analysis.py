#!/usr/bin/env python3
"""Unit tests for validate_analysis.py."""

import unittest

from validate_analysis import ValidationError, validate


def standalone():
    return {
        "audio": {"path": "song.wav", "duration_seconds": 2},
        "key": {"confidence": 0.7},
        "tempo": {"confidence": 0.8},
        "sections": [],
        "timestamped_chords": [
            {"start": 0, "end": 2, "chord": "C", "confidence": 0.8}
        ],
        "simplified_chart": [],
        "advanced_chart": [],
        "ambiguities": [],
        "warnings": [],
    }


def module():
    data = standalone()
    data.update(
        {
            "mode": "audio_to_score_module",
            "form_context": {
                "status": "approved",
                "source_artifact": "05_form_map.json",
            },
            "form_change_requests": [],
            "timestamped_chords": [
                {
                    "event_id": "harm-m1-1",
                    "measure_id": "m1",
                    "start": 0,
                    "end": 2,
                    "onset_beat": 1,
                    "duration_beats": 4,
                    "section_id": "sec-a-1",
                    "occurrence": 1,
                    "recurrence_group": "rg-a",
                    "bar_in_section": 1,
                    "chord": "Cmaj7",
                    "confidence": 0.8,
                    "alternatives": ["C"],
                    "evidence_refs": ["ev-chroma-1"],
                    "consensus_action": "kept",
                }
            ],
        }
    )
    return data


class ValidateAnalysisTests(unittest.TestCase):
    def test_accepts_backward_compatible_standalone(self):
        self.assertTrue(validate(standalone()))

    def test_accepts_form_aware_module(self):
        self.assertTrue(validate(module()))

    def test_rejects_unapproved_module_form(self):
        data = module()
        data["form_context"]["status"] = "provisional"
        with self.assertRaises(ValidationError):
            validate(data)

    def test_rejects_missing_form_coordinate(self):
        data = module()
        del data["timestamped_chords"][0]["bar_in_section"]
        with self.assertRaises(ValidationError):
            validate(data)

    def test_rejects_generated_harmony(self):
        data = module()
        data["timestamped_chords"][0]["provenance"] = "generated"
        with self.assertRaises(ValidationError):
            validate(data)


if __name__ == "__main__":
    unittest.main()
