import type { ReactNode } from "react";

/** A small boxed note: honest caveats ("not medical advice") or a warning. */
export function Notice({
  tone = "muted",
  children,
}: {
  tone?: "muted" | "coral";
  children: ReactNode;
}) {
  return (
    <p
      className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
        tone === "coral" ? "border-coral/60 text-coral" : "border-line text-muted"
      }`}
    >
      {children}
    </p>
  );
}
