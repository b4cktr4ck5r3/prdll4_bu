import FetchWorkScheduleTasks from "@lib/swr/fetchers/FetchWorkScheduleTasks";
import { useMemo } from "react";
import useSWR from "swr";

type Props = {
  workScheduleId?: string;
  startDate?: Date;
  endDate?: Date;
};

export default function useWorkScheduleTasks({
  workScheduleId,
  endDate,
  startDate,
}: Props = {}) {
  const requestName = useMemo(() => {
    let name = "workScheduleTasks";
    if (workScheduleId) name += "-" + workScheduleId;
    if (startDate) name += "-" + startDate.toISOString();
    if (endDate) name += "-" + endDate.toISOString();
    return name;
  }, [endDate, startDate, workScheduleId]);

  const { data: workScheduleTasks, mutate } = useSWR(requestName, () =>
    FetchWorkScheduleTasks(workScheduleId, startDate, endDate)
  );

  return {
    workScheduleTasks: workScheduleTasks || [],
    mutate,
  };
}
