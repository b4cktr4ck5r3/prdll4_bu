import FetchWorkScheduleTasks from "@lib/swr/fetchers/FetchWorkScheduleTasks";
import useSWR from "swr";

export default function useWorkScheduleTasks(workScheduleId?: string) {
  const { data: workScheduleTasks, mutate } = useSWR("workScheduleTasks", () =>
    FetchWorkScheduleTasks(workScheduleId)
  );

  return {
    workScheduleTasks: workScheduleTasks || [],
    mutate,
  };
}
