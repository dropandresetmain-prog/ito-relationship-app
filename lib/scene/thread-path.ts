import type { Point } from "./types";

/** Build a gentle curved SVG path (0–100 space) from tree anchor to charm knot. */
export function threadPath(anchor: Point, knot: Point): string {
  const midX = (anchor.x + knot.x) / 2;
  const midY = (anchor.y + knot.y) / 2;
  const bow = (knot.x - anchor.x) * 0.18;
  const cx = midX + bow;
  const cy = midY + 6;
  return `M ${anchor.x} ${anchor.y} Q ${cx} ${cy} ${knot.x} ${knot.y}`;
}
