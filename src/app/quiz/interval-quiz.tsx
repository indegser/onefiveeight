"use client";

import { ArrowRight, Eye, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

type NaturalDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type Degree = {
  label: string;
  naturalDegree: NaturalDegree;
  accidental: -1 | 0 | 1;
};

type Scale = {
  root: string;
  notes: readonly [string, string, string, string, string, string, string];
};

type Question = {
  root: string;
  degree: string;
  answer: string;
};

const DEGREES: readonly Degree[] = [
  { label: "b2", naturalDegree: 2, accidental: -1 },
  { label: "2", naturalDegree: 2, accidental: 0 },
  { label: "b3", naturalDegree: 3, accidental: -1 },
  { label: "3", naturalDegree: 3, accidental: 0 },
  { label: "4", naturalDegree: 4, accidental: 0 },
  { label: "#4", naturalDegree: 4, accidental: 1 },
  { label: "5", naturalDegree: 5, accidental: 0 },
  { label: "b6", naturalDegree: 6, accidental: -1 },
  { label: "6", naturalDegree: 6, accidental: 0 },
  { label: "b7", naturalDegree: 7, accidental: -1 },
  { label: "7", naturalDegree: 7, accidental: 0 },
];

const MAJOR_SCALES: readonly Scale[] = [
  { root: "C", notes: ["C", "D", "E", "F", "G", "A", "B"] },
  { root: "G", notes: ["G", "A", "B", "C", "D", "E", "F#"] },
  { root: "D", notes: ["D", "E", "F#", "G", "A", "B", "C#"] },
  { root: "A", notes: ["A", "B", "C#", "D", "E", "F#", "G#"] },
  { root: "E", notes: ["E", "F#", "G#", "A", "B", "C#", "D#"] },
  { root: "B", notes: ["B", "C#", "D#", "E", "F#", "G#", "A#"] },
  { root: "F#", notes: ["F#", "G#", "A#", "B", "C#", "D#", "E#"] },
  { root: "C#", notes: ["C#", "D#", "E#", "F#", "G#", "A#", "B#"] },
  { root: "F", notes: ["F", "G", "A", "Bb", "C", "D", "E"] },
  { root: "Bb", notes: ["Bb", "C", "D", "Eb", "F", "G", "A"] },
  { root: "Eb", notes: ["Eb", "F", "G", "Ab", "Bb", "C", "D"] },
  { root: "Ab", notes: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"] },
  { root: "Db", notes: ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"] },
  { root: "Gb", notes: ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"] },
  { root: "Cb", notes: ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"] },
];

const NATURAL_NOTE_PITCH_CLASS: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const SIMPLE_NOTE_NAMES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;

function pickRandom<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function normalizeDoubleAccidental(note: string) {
  if (!note.includes("bb") && !note.includes("##")) {
    return note;
  }

  const letter = note[0];
  const accidentals = note.slice(1);
  const basePitchClass = NATURAL_NOTE_PITCH_CLASS[letter];
  const offset = Array.from(accidentals).reduce((total, accidental) => {
    if (accidental === "#") {
      return total + 1;
    }

    if (accidental === "b") {
      return total - 1;
    }

    return total;
  }, 0);
  const pitchClass = (basePitchClass + offset + 120) % 12;

  return SIMPLE_NOTE_NAMES[pitchClass];
}

function adjustNote(note: string, accidental: Degree["accidental"]) {
  if (accidental === 0) {
    return note;
  }

  const letter = note[0];
  const accidentals = note.slice(1);

  if (accidental === 1) {
    if (accidentals.endsWith("b")) {
      return `${letter}${accidentals.slice(0, -1)}`;
    }

    return normalizeDoubleAccidental(`${letter}${accidentals}#`);
  }

  if (accidentals.endsWith("#")) {
    return `${letter}${accidentals.slice(0, -1)}`;
  }

  return normalizeDoubleAccidental(`${letter}${accidentals}b`);
}

function createQuestion(previous?: Question): Question {
  const scale = pickRandom(MAJOR_SCALES);
  const degree = pickRandom(DEGREES);
  const naturalAnswer = scale.notes[degree.naturalDegree - 1];
  const nextQuestion = {
    root: scale.root,
    degree: degree.label,
    answer: adjustNote(naturalAnswer, degree.accidental),
  };

  if (
    previous &&
    previous.root === nextQuestion.root &&
    previous.degree === nextQuestion.degree
  ) {
    return createQuestion(previous);
  }

  return nextQuestion;
}

export function IntervalQuiz() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  useEffect(() => {
    setQuestion(createQuestion());
  }, []);

  function handlePrimaryAction() {
    if (!question) {
      return;
    }

    if (!isAnswerVisible) {
      setIsAnswerVisible(true);
      return;
    }

    setQuestion(createQuestion(question));
    setIsAnswerVisible(false);
  }

  if (!question) {
    return (
      <section className="rounded-lg border border-[var(--tone-border)] bg-[var(--tone-surface)] p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3 text-sm text-[var(--tone-text-secondary)]">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          문제 준비 중
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[var(--tone-border)] bg-[var(--tone-surface)] p-6 shadow-sm md:p-8">
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--tone-text-secondary)]">
            <span className="rounded-md bg-[var(--tone-accent-soft)] px-2.5 py-1 font-medium text-[var(--tone-text-primary)]">
              장음계
            </span>
            <span>
              {question.root} major · {question.degree}도
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-2xl leading-tight font-semibold md:text-4xl">
              {question.root}의 {question.degree}도는 뭐야?
            </p>
            <div
              aria-live="polite"
              className="min-h-16 rounded-md border border-[var(--tone-border)] bg-white px-4 py-4"
            >
              {isAnswerVisible ? (
                <p className="text-3xl leading-none font-semibold text-[var(--tone-text-primary)] md:text-5xl">
                  {question.answer}
                </p>
              ) : (
                <p className="text-sm leading-6 text-[var(--tone-text-muted)]">
                  정답은 버튼을 누르면 공개됩니다.
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrimaryAction}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--tone-text-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tone-accent)] md:w-40"
        >
          {isAnswerVisible ? (
            <ArrowRight className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
          {isAnswerVisible ? "다음 질문" : "정답 보기"}
        </button>
      </div>
    </section>
  );
}
