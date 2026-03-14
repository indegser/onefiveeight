"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Canvas" },
  { href: "/chords", label: "Chords" },
  { href: "/voicings", label: "Voicings" },
  { href: "/songs", label: "Songs" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-6 px-6 py-4 md:px-10 lg:px-16">
        <div>
          <p className="type-kicker-wide text-gray-400 uppercase">
            One Five Eight
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Theory tools and song library
          </p>
        </div>
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center justify-end gap-2"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
