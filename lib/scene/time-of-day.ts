import type { TimeOfDay } from "./types";

export function getTimeOfDay(timezone?: string | null): TimeOfDay {
  const now = new Date();
  const hour = timezone
    ? Number(
        new Intl.DateTimeFormat("en-GB", {
          hour: "numeric",
          hour12: false,
          timeZone: timezone,
        }).format(now)
      )
    : now.getHours();

  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function sceneForTime(
  scenes: { morning: string; day: string; evening: string },
  time: TimeOfDay
): string {
  if (time === "night") return scenes.evening;
  return scenes[time === "morning" || time === "day" || time === "evening" ? time : "day"];
}
