export type ClassValue = string | number | null | false | undefined;

/** Join truthy class values. */
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}
