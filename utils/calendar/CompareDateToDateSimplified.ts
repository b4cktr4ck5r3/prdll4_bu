import { DateSimplified } from "./Date";

export function CompareDateToDateSimplified(
  date: Date,
  dateSimplified: DateSimplified
) {
  return (
    date.getFullYear() === dateSimplified.year &&
    date.getMonth() === dateSimplified.month &&
    date.getDate() === dateSimplified.date
  );
}
