export function GetMonthLabel(date: Date) {
  return date.toLocaleString("default", { month: "long" });
}
