import type { ReactNode } from "react";

/**
 * A form's main actions, pinned just above the bottom nav so they stay in
 * thumb reach and never scroll out of view behind it.
 */
export function ActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-[calc(3.5rem+1px+env(safe-area-inset-bottom))] -mx-5 mt-auto flex flex-col gap-3 bg-bg/95 px-5 pt-4 pb-3 backdrop-blur">
      {children}
    </div>
  );
}
