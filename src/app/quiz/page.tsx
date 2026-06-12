import type { Metadata } from "next";
import { IntervalQuiz } from "./interval-quiz";

export const metadata: Metadata = {
  title: "Interval Quiz | One Five Eight",
  description: "Practice random root and scale-degree note names.",
};

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-[var(--tone-canvas)] px-5 py-8 text-[var(--tone-text-primary)] md:px-10 md:py-12 lg:px-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="type-kicker text-[var(--tone-text-muted)] uppercase">
            Scale Degree Drill
          </p>
          <h1 className="text-3xl leading-tight font-semibold md:text-4xl">
            음정 퀴즈
          </h1>
          <p className="max-w-xl text-sm leading-6 text-[var(--tone-text-secondary)] md:text-base">
            랜덤 루트의 장음계 도수를 보고, 버튼으로 정답을 확인하세요.
          </p>
        </div>
        <IntervalQuiz />
      </div>
    </main>
  );
}
