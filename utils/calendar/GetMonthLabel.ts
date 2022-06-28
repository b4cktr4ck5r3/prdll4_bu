import dayjs from "dayjs";

export function GetMonthLabel(date: Date | string) {
  return dayjs(date).toDate().toLocaleString("fr", { month: "long" });
}
