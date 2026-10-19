import { useId, type ComponentProps, type ReactNode } from "react";

/** A checkbox with its label as the tap target (44px tall), and an optional hint. */
export function Checkbox({
  label,
  hint,
  ...input
}: Omit<ComponentProps<"input">, "type" | "id"> & { label: ReactNode; hint?: ReactNode }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex min-h-11 items-center gap-3 text-base">
        <input
          id={id}
          type="checkbox"
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="size-5 accent-amber"
          {...input}
        />
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="pl-8 text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
