import { useId, type ComponentProps, type ReactNode } from "react";

type FieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  /** Says what to do next, e.g. "Enter the caffeine in mg, it's on the can." */
  error?: string;
  hint?: ReactNode;
  /** A unit shown inside the input, e.g. "mg". */
  suffix?: string;
};

/** Label, input, hint and error together, so the error always sits next to its field. */
export function Field({ label, error, hint, suffix, className = "", ...input }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-base font-medium text-text">
        {label}
        {/* The visible unit sits inside the input and is hidden from screen readers, so say it here. */}
        {suffix && <span className="sr-only">, in {suffix}</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={`min-h-12 w-full rounded-xl border bg-surface px-4 text-lg text-text tabular-nums placeholder:text-muted ${
            suffix ? "pr-14" : ""
          } ${error ? "border-coral" : "border-edge"}`}
          {...input}
        />
        {suffix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted"
          >
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-medium text-coral">
          {error}
        </p>
      )}
    </div>
  );
}
