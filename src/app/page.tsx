import { getAllChords } from "@/lib/chord";

export default function Home() {
  const rootNote = "A";
  const chords = getAllChords(rootNote);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center">Chord Types</h1>
        <div className="grid grid-cols-4 gap-8">
          {chords.map((chord) => (
            <div
              key={chord.id}
              className="flex flex-col gap-2 items-center sm:items-start"
            >
              <h2 className="text-sm font-bold">{`${rootNote} ${chord.label}`}</h2>
              <div className="flex gap-4">
                {chord.notes.map((note, index) => (
                  <div key={note} className="flex flex-col gap-2 items-center">
                  <div
                    className="flex items-center justify-center w-8 h-8 text-gray-300 font-semibold text-xs bg-gray-700 rounded-full"
                  >
                    {note}
                  </div>
                    <div className="text-xs text-gray-400">{chord.formula[index]}</div>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
