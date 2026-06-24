import type { TimeOfDay } from "./types";

/** Evening and night backdrops need light foreground text on the scenic layer. */
export function isDimScene(time: TimeOfDay): boolean {
  return time === "evening" || time === "night";
}

export const sceneHeroTextClass = "text-shadow-soft text-card";
export const sceneHeroTextMutedClass = "text-shadow-soft text-card/85";
