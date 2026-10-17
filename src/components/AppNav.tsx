"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Now" },
  { href: "/sleep", label: "Sleep" },
  { href: "/log", label: "Log" },
  { href: "/settings", label: "Settings" },
];

/** Shared bottom navigation: always shows where you are and how to get back. */
export function AppNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex max-w-md">
        {ITEMS.map((item) => {
          const current = path === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 text-sm font-medium focus-visible:-outline-offset-4 ${
                  current ? "text-amber" : "text-muted hover:text-text"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1 w-6 rounded-full ${current ? "bg-amber" : "bg-transparent"}`}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
