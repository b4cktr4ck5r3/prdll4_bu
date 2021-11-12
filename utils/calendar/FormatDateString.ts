import { DateSimplified } from "./Date";

export function FormatDateString({ date, month, year }: DateSimplified) {
  return `${year}-${(month + 1).toString().padStart(2, "0")}-${date
    .toString()
    .padStart(2, "0")}T00:00:00.000Z`;
}
