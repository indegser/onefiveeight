import { Caged } from "./canvas/Canvas";
import { Settings } from "./settings/settings";

export default function Home() {
  return (
    <div className="min-h-screen bg-white p-8 font-[family-name:var(--font-geist-sans)] text-gray-900 md:p-12 lg:p-20">
      <main className="row-start-2 flex flex-col gap-[32px]">
        <Settings />
        <div>
          <Caged />
        </div>
      </main>
    </div>
  );
}
