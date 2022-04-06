export function GetMonthLabel(date: Date | string) {
  return new Date(date).toLocaleString("fr", { month: "long" });
}
