#!/usr/bin/env python3
"""Unit tests for portable preprocessing helpers."""

import tempfile
import unittest
from pathlib import Path
from unittest import mock

from preprocess_audio import find_binary, inspect_with_soundfile, main


class PreprocessAudioTests(unittest.TestCase):
    def test_explicit_binary_wins(self):
        with tempfile.TemporaryDirectory() as directory:
            binary = Path(directory) / "ffmpeg"
            binary.write_text("#!/bin/sh\n", encoding="utf-8")
            binary.chmod(0o755)
            self.assertEqual(find_binary("ffmpeg", str(binary)), str(binary.resolve()))

    def test_missing_explicit_binary_returns_none(self):
        self.assertIsNone(find_binary("ffmpeg", "/definitely/missing/ffmpeg"))

    def test_soundfile_fallback_reads_wave_metadata(self):
        try:
            import numpy
            import soundfile
        except ImportError:
            self.skipTest("numpy and soundfile are optional runtime dependencies")

        with tempfile.TemporaryDirectory() as directory:
            audio = Path(directory) / "tone.wav"
            soundfile.write(audio, numpy.zeros(8000), 8000)
            metadata = inspect_with_soundfile(audio)
            self.assertEqual(metadata["sample_rate"], 8000)
            self.assertEqual(metadata["channels"], 1)
            self.assertAlmostEqual(metadata["duration_seconds"], 1.0, places=2)
            self.assertEqual(metadata["inspection_backend"], "soundfile")

    @mock.patch("preprocess_audio.shutil.which", return_value=None)
    @mock.patch("preprocess_audio.COMMON_BINARY_ROOTS", [])
    @mock.patch("preprocess_audio.Path.glob", return_value=[])
    def test_no_binary_returns_none(self, _glob, _which):
        self.assertIsNone(find_binary("ffmpeg"))

    def test_main_rejects_invalid_explicit_ffprobe(self):
        try:
            import numpy
            import soundfile
        except ImportError:
            self.skipTest("numpy and soundfile are optional runtime dependencies")

        with tempfile.TemporaryDirectory() as directory:
            audio = Path(directory) / "tone.wav"
            soundfile.write(audio, numpy.zeros(8000), 8000)
            argv = [
                "preprocess_audio.py",
                str(audio),
                "--workdir",
                directory,
                "--no-convert",
                "--ffprobe",
                "/definitely/missing/ffprobe",
            ]
            with mock.patch("preprocess_audio.sys.argv", argv):
                self.assertEqual(main(), 2)

    def test_main_reports_ffmpeg_conversion_failure(self):
        try:
            import numpy
            import soundfile
        except ImportError:
            self.skipTest("numpy and soundfile are optional runtime dependencies")

        with tempfile.TemporaryDirectory() as directory:
            audio = Path(directory) / "tone.wav"
            soundfile.write(audio, numpy.zeros(8000), 8000)
            argv = [
                "preprocess_audio.py",
                str(audio),
                "--workdir",
                directory,
                "--ffmpeg",
                "/usr/bin/false",
            ]
            with mock.patch("preprocess_audio.sys.argv", argv):
                self.assertEqual(main(), 4)


if __name__ == "__main__":
    unittest.main()
