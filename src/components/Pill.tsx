import type { ComponentProps } from "react";

/** A small rounded choice, like "Black tea 47 mg" on /log, that fills in the form. */
export function Pill({ className = "", type = "button", ...props }: ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={`min-h-11 rounded-full border border-edge bg-surface px-4 text-sm hover:bg-raised ${className}`}
      {...props}
    />
  );
}
