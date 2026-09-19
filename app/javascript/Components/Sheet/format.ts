// Signed modifier: 3 -> "+3", -1 -> "-1", 0 -> "+0".
export const signed = (n: number): string => (n >= 0 ? `+${n}` : `${n}`);

export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));
