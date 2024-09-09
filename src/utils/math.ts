export function roundToNearestPrecision(num: number, precision: number) {
  if (!precision) return num;
  return Math.round(num / precision) * precision;
}
