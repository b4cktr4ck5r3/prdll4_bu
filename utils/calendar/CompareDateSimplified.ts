import { DateSimplified } from "./Date";

export function CompareDateSimplified(
  date1: DateSimplified,
  date2: DateSimplified
) {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.date === date2.date
  );
}
