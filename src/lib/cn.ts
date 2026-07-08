// Tiny classname joiner (clsx-style) — no dependency.
// Filters falsy values and joins with spaces. Pass user `className` last so it
// appends after the component defaults.
export type ClassValue = string | number | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
