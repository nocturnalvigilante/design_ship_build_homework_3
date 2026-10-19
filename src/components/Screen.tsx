import Link from "next/link";
import type { ReactNode } from "react";
import { AppNav } from "./AppNav";

/** Every route's frame: the wordmark, one heading, content, and the shared nav. */
export function Screen({
  title,
  hideTitle,
  pageHasHeading,
  wide,
  children,
}: {
  title: string;
  /** Keep the heading for screen readers but let the content lead visually. */
  hideTitle?: boolean;
  /** The page renders its own visible <h1>, so don't add a second one. */
  pageHasHeading?: boolean;
  /** Use the width of a laptop screen (Now's two columns) instead of a phone column. */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <div className={`mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-5 pb-24 ${wide ? "lg:max-w-5xl lg:px-10 lg:pt-8" : ""}`}>
        <header className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="-mx-1 flex min-h-11 items-center px-1 font-display text-sm font-semibold tracking-wide text-amber"
          >
            Last Cup
          </Link>
          <p className="hidden text-sm text-muted lg:block">Saved on this device</p>
        </header>
        {!pageHasHeading && (
          <h1 className={hideTitle ? "sr-only" : "mb-6 font-display text-2xl font-semibold"}>
            {title}
          </h1>
        )}
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
      <AppNav />
    </>
  );
}

/** Placeholder while localStorage is read, so nobody sees the wrong screen flash. */
export function Loading() {
  return <div aria-busy="true" className="flex-1" />;
}
