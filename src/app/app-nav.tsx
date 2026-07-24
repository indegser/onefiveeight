"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Canvas" },
  { href: "/songs", label: "Songs" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 font-[family-name:var(--font-geist-sans)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-10 lg:px-16">
        <Link
          href="/"
          className="inline-flex min-h-11 shrink-0 items-center text-[15px] font-semibold tracking-[-0.03em] text-foreground transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
        >
          One Five Eight
        </Link>
        <nav
          aria-label="Primary"
          className="flex h-full items-stretch gap-1 sm:gap-2"
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
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-center after:bg-foreground after:transition-transform after:duration-200 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring motion-reduce:transition-none motion-reduce:after:transition-none",
                  isActive
                    ? "text-foreground after:scale-x-100"
                    : "text-muted-foreground after:scale-x-0 hover:text-foreground hover:after:scale-x-100",
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
