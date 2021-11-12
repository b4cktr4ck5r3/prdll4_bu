import { DateSimplified } from "./Date";

export function GetActiveWeekIndex(date: Date, weeks: DateSimplified[][]) {
  return weeks.findIndex((week) =>
    week.find((e) => e.date === date.getDate() && e.month === date.getMonth())
  );
}
