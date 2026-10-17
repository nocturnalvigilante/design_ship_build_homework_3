import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold transition-colors disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Dark text on amber: 9.2:1.
  primary: "bg-amber text-bg hover:bg-amber/90",
  secondary: "border border-edge bg-raised text-text hover:bg-line",
  ghost: "text-amber underline-offset-4 hover:underline",
};

type Common = { variant?: Variant; full?: boolean; children: ReactNode; className?: string };

type AsButton = Common & ComponentProps<"button"> & { href?: undefined };
type AsLink = Common & { href: string };

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", full, children, className = "" } = props;
  const classes = `${base} ${variants[variant]} ${full ? "w-full" : ""} ${className}`;

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, full: _f, className: _c, type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
