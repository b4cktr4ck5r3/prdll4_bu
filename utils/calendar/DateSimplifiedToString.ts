import { DateSimplified } from "@utils/calendar/Date";
import { GetMonthLabel } from "@utils/calendar/GetMonthLabel";

export function DateSimplifiedToString({ date, month, year }: DateSimplified) {
  return `${date} ${GetMonthLabel(new Date(year, month))} ${year}`;
}
