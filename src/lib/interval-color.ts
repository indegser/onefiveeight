// interval-color2k.ts

import { get } from "@tonaljs/interval";
import clsx from "clsx";

/**
 * Tailwind-based palette (500 tone).
 * key: diatonic degree (1–7), value: HEX color
 */
const DEGREE_TO_COLOR: Record<number, string> = {
  1: clsx`bg-black text-gray-100`, // 1도는 검정색
  2: clsx`bg-rose-300 text-rose-900`,
  3: clsx`bg-orange-300 text-orange-900`,
  4: clsx`bg-amber-300 text-amber-900`,
  5: clsx`bg-emerald-300 text-emerald-900`,
  6: clsx`bg-indigo-300 text-indigo-800`,
  7: clsx`bg-violet-300 text-violet-900`,
};
/**
 * 인터벌 문자열(예: "3M", "4P")에 대응되는 HEX 컬러를 돌려준다.
 * 앞자리가 같은 인터벌(3M·3m 등)은 동일 색.
 */
export function colorForInterval(interval: string): string {
  const { num } = get(interval); // ±정수, 예: 3M → 3
  if (num === null) throw new Error(`Invalid interval: ${interval}`);

  const degree = ((Math.abs(num) - 1) % 7) + 1; // 1~7
  return DEGREE_TO_COLOR[degree];
}

/**
 * 필요하면 한 번에 맵 생성
 */
export const intervalColorMap: Record<string, string> = [
  // 1도
  "1P",
  // 2도
  "2m",
  "2M",
  "2A",
  // 3도
  "3m",
  "3M",
  // 4도
  "4d",
  "4P",
  "4A",
  // 5도
  "5d",
  "5P",
  "5A",
  // 6도
  "6m",
  "6M",
  // 7도
  "7d",
  "7m",
  "7M",
  // 옥타브·컴파운드
  "8P",
  "9m",
  "9M",
  "10m",
  "10M",
  "11P",
  "11A",
  "13M",
].reduce<Record<string, string>>((acc, ivl) => {
  acc[ivl] = colorForInterval(ivl);
  return acc;
}, {});
