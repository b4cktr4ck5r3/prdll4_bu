import FetchWorkScheduleTaskNames from "@lib/swr/fetchers/FetchWorkScheduleTaskNames";
import useSWR from "swr";

export function useWorkScheduleTaskNames() {
  const { data: workScheduleTaskNames, mutate } = useSWR(
    "WorkScheduleTaskNames",
    () => FetchWorkScheduleTaskNames()
  );

  return {
    workScheduleTaskNames:
      workScheduleTaskNames?.sort((a, b) => a.name.localeCompare(b.name)) || [],
    mutate,
  };
}
