import { DateSimplified } from "./Date";

export function GetDaysInMonth(current_date: Date): DateSimplified[][] {
  const before_days: DateSimplified[] = [];
  const after_days: DateSimplified[] = [];

  let date: Date = new Date(current_date);

  while (true) {
    date.setDate(date.getDate() - 1);
    if (date.getMonth() !== current_date.getMonth() && date.getDay() === 0)
      break;
    before_days.push({
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }

  date = new Date(current_date);
  while (true) {
    date.setDate(date.getDate() + 1);
    if (date.getMonth() !== current_date.getMonth() && date.getDay() === 1)
      break;
    after_days.push({
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }
  return [
    ...before_days.reverse(),
    {
      date: current_date.getDate(),
      month: current_date.getMonth(),
      year: current_date.getFullYear(),
    },
    ...after_days,
  ].reduce<DateSimplified[][]>(
    (weeks, date) => {
      if (weeks[weeks.length - 1].length === 7) weeks.push([]);
      weeks[weeks.length - 1].push(date);
      return weeks;
    },
    [[]]
  );
}
