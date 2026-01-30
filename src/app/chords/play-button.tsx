"use client";

interface Props {
  label: string;
  onClick: () => void | Promise<void>;
}

export function PlayButton({ label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
      aria-label={label}
    >
      ▶︎ 재생
    </button>
  );
}
