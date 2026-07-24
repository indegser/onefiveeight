#!/usr/bin/env python3
"""Unit tests for non-authoritative harmony evidence helpers."""

import unittest

try:
    import numpy
except ImportError:
    numpy = None

from extract_harmony_evidence import (
    build_grid_hypotheses,
    build_recurrence_candidates,
    build_tempo_hypotheses,
    score_chord_candidates,
    score_key_hypotheses,
)


@unittest.skipIf(numpy is None, "numpy is an optional runtime dependency")
class ExtractHarmonyEvidenceTests(unittest.TestCase):
    def test_preserves_half_and_double_time_hypotheses(self):
        hypotheses = build_tempo_hypotheses(70)
        self.assertEqual([item["bpm"] for item in hypotheses], [35.0, 70.0, 140.0])
        self.assertTrue(all(item["requires_agent_selection"] for item in hypotheses))

    def test_grid_hypotheses_require_agent_selection(self):
        tempos = build_tempo_hypotheses(70)
        grids = build_grid_hypotheses(numpy.array([0.5, 1.35, 2.2, 3.05]), tempos, 4)
        self.assertEqual(len(grids), 3)
        self.assertTrue(all(grid["requires_agent_selection"] for grid in grids))
        self.assertEqual(len(grids[0]["anchor_candidates"]), 4)

    def test_simple_major_is_not_inflated_to_major_seventh(self):
        chroma = numpy.zeros(12)
        chroma[[0, 4, 7]] = [1.0, 0.9, 0.8]
        candidates = score_chord_candidates(chroma, numpy, limit=10)
        names = [candidate["chord"] for candidate in candidates]
        self.assertLess(names.index("C"), names.index("Cmaj7"))
        major_seventh = next(
            candidate for candidate in candidates if candidate["chord"] == "Cmaj7"
        )
        self.assertGreater(major_seventh["complexity_penalty"], 0)

    def test_key_output_preserves_multiple_hypotheses(self):
        chroma = numpy.zeros(12)
        chroma[[0, 3, 7]] = [1.0, 0.8, 0.9]
        hypotheses = score_key_hypotheses(chroma, numpy)
        self.assertEqual(len(hypotheses), 6)
        self.assertIn("evidence_support", hypotheses[0])

    def test_recurrence_similarity_remains_non_authoritative(self):
        vectors = [
            numpy.array([1.0, 0.0, 0.0]),
            numpy.array([0.0, 1.0, 0.0]),
            numpy.array([0.9, 0.1, 0.0]),
        ]
        recurrence = build_recurrence_candidates(
            ["seg-1", "seg-2", "seg-3"],
            vectors,
            numpy,
            min_separation=2,
        )
        self.assertTrue(recurrence[0]["requires_agent_interpretation"])
        self.assertEqual(recurrence[0]["peers"][0]["segment_id"], "seg-3")
        self.assertNotIn("section_id", recurrence[0])


if __name__ == "__main__":
    unittest.main()
