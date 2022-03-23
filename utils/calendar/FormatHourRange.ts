import dayjs from "dayjs";

export function FormatHourRange(
  startDate: Date | string,
  endDate: Date | string
) {
  return `${dayjs(startDate).format("HH:mm")} - ${dayjs(endDate).format(
    "HH:mm"
  )}`;
}
