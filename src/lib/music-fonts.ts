export const MUSIC_FONTS = [
  {
    id: "bravura",
    name: "Bravura",
    description: "alphaTab 기본값 · 균형 잡힌 현대 출판 악보",
  },
  {
    id: "petaluma",
    name: "Petaluma",
    description: "Real Book 계열의 손글씨 악보",
  },
  {
    id: "gootville",
    name: "Gonville / Gootville",
    description: "Gonville 계열의 SMuFL 호환판",
  },
  {
    id: "finale-maestro",
    name: "Finale Maestro",
    description: "Finale의 전통적인 클래식 조판",
  },
  {
    id: "emmentaler",
    name: "Emmentaler / MScore",
    description: "MuseScore의 Emmentaler 계열 SMuFL 호환판",
  },
  {
    id: "leland",
    name: "Leland",
    description: "SCORE 출판 시스템에서 영감을 받은 조판",
  },
] as const;

export type MusicFontId = (typeof MUSIC_FONTS)[number]["id"];

export function getMusicFont(id: MusicFontId) {
  return MUSIC_FONTS.find((font) => font.id === id) ?? MUSIC_FONTS[0];
}

export const CHORD_FONTS = [
  {
    id: "edwin",
    name: "Edwin",
    family: "Score Edwin",
    font: '700 13px "Score Edwin", Georgia, serif',
  },
  {
    id: "jazzcord",
    name: "JazzCord",
    family: "Score JazzCord",
    font: '400 15px "Score JazzCord", cursive',
  },
  {
    id: "campania",
    name: "Campania",
    family: "Score Campania",
    font: '400 14px "Score Campania", Georgia, serif',
  },
] as const;

export type ChordFontId = (typeof CHORD_FONTS)[number]["id"];

export function getChordFont(id: ChordFontId) {
  return CHORD_FONTS.find((font) => font.id === id) ?? CHORD_FONTS[0];
}
