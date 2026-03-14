import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import type {
  AudioInput,
  UncertaintyItem,
} from "../../schemas/music-analysis";
import type { AudioAdapterOutput, AudioAnalysisAdapter } from "./types";

const execFileAsync = promisify(execFile);

const pythonOutputSchema = z.object({
  bpm: z.number().nullable().optional(),
  meterHint: z.string().nullable().optional(),
  beats: z
    .array(
      z.object({
        index: z.number().int().nonnegative(),
        time: z.number().nonnegative(),
      }),
    )
    .optional(),
  downbeats: z
    .array(
      z.object({
        beatIndex: z.number().int().nonnegative(),
        time: z.number().nonnegative(),
        confidence: z.number().min(0).max(1),
      }),
    )
    .optional(),
  bars: z
    .array(
      z.object({
        index: z.number().int().nonnegative(),
        startBeat: z.number().int().nonnegative(),
        endBeat: z.number().int().positive(),
        startTime: z.number().nonnegative(),
        endTime: z.number().nonnegative(),
        confidence: z.number().min(0).max(1),
      }),
    )
    .optional(),
  rootCandidates: z
    .array(
      z.object({
        barIndex: z.number().int().nonnegative(),
        root: z.string(),
        confidence: z.number().min(0).max(1),
        alternatives: z
          .array(
            z.object({
              root: z.string(),
              confidence: z.number().min(0).max(1),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
  frameChordCandidates: z
    .array(
      z.object({
        barIndex: z.number().int().nonnegative(),
        candidates: z.array(
          z.object({
            symbol: z.string(),
            confidence: z.number().min(0).max(1),
          }),
        ),
      }),
    )
    .optional(),
  chordCandidates: z.array(
    z.object({
      symbol: z.string(),
      confidence: z.number().min(0).max(1),
      startBeat: z.number().nonnegative(),
      endBeat: z.number().positive(),
      startBar: z.number().int().nonnegative().optional(),
      endBar: z.number().int().positive().optional(),
    }),
  ),
  separationArtifacts: z
    .object({
      engine: z.enum(["demucs", "hpss", "none"]),
      directory: z.string().optional().nullable(),
      stems: z
        .object({
          bass: z.string().optional(),
          drums: z.string().optional(),
          vocals: z.string().optional(),
          other: z.string().optional(),
        })
        .partial()
        .optional(),
    })
    .optional(),
  stages: z
    .array(
      z.object({
        stage: z.enum([
          "preprocess",
          "separation",
          "rhythm",
          "harmony",
          "smoothing",
          "aggregation",
        ]),
        status: z.enum(["passed", "skipped", "failed"]),
        details: z.string(),
      }),
    )
    .optional(),
  uncertainty: z.array(
    z.object({
      scope: z.enum(["source", "measure", "event", "key", "meter", "analysis"]),
      ref: z.string(),
      severity: z.enum(["low", "medium", "high"]),
      message: z.string(),
      recommendation: z.string().nullable().optional(),
    }),
  ),
});

export class PythonLibrosaAudioAdapter implements AudioAnalysisAdapter {
  readonly name = "python-mir-demucs";
  private readonly pythonBin: string;

  constructor(options?: { pythonBin?: string }) {
    this.pythonBin = options?.pythonBin ?? process.env.PYTHON_BIN ?? "python3";
  }

  async analyze(input: AudioInput): Promise<AudioAdapterOutput> {
    const scriptPath = fileURLToPath(
      new URL("./librosa-audio-analysis.py", import.meta.url),
    );

    try {
      const { stdout, stderr } = await execFileAsync(this.pythonBin, [
        scriptPath,
        input.filePath,
      ]);

      const parsed = pythonOutputSchema.parse(JSON.parse(stdout.trim()));
      const uncertainty: UncertaintyItem[] = parsed.uncertainty.map((item) => ({
        ...item,
        recommendation: item.recommendation ?? null,
      }));

      if (stderr.trim()) {
        uncertainty.push({
          scope: "source",
          ref: input.filePath,
          severity: "low",
          message: `Python audio adapter reported stderr output: ${stderr.trim()}`,
          recommendation:
            "Inspect the adapter environment if this warning repeats across files.",
        });
      }

      return {
        bpm: parsed.bpm ?? undefined,
        meterHint: parsed.meterHint ?? undefined,
        beats: parsed.beats,
        downbeats: parsed.downbeats,
        bars: parsed.bars,
        rootCandidates: parsed.rootCandidates,
        frameChordCandidates: parsed.frameChordCandidates,
        chordCandidates: parsed.chordCandidates,
        separationArtifacts: parsed.separationArtifacts
          ? {
              engine: parsed.separationArtifacts.engine,
              directory: parsed.separationArtifacts.directory ?? undefined,
              stems: parsed.separationArtifacts.stems,
            }
          : undefined,
        stages: parsed.stages,
        uncertainty,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown audio adapter failure.";

      return {
        chordCandidates: [],
        uncertainty: [
          {
            scope: "source",
            ref: input.filePath,
            severity: "high",
            message: `Python librosa adapter failed: ${message}`,
            recommendation:
              "Verify that python3 plus librosa can read the file, or provide symbolic evidence instead.",
          },
        ],
      };
    }
  }
}
