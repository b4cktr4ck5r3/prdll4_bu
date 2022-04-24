import FetchWorkScheduleTasks from "@lib/swr/fetchers/FetchWorkScheduleTasks";
import { useMemo } from "react";
import useSWR from "swr";

type Props = {
  workScheduleId?: string;
  startDate?: Date;
  endDate?: Date;
  acceptEqualDate?: boolean;
  activeOnly?: boolean;
};

export function useWorkScheduleTasks({
  workScheduleId,
  endDate,
  startDate,
  acceptEqualDate,
  activeOnly = true,
}: Props = {}) {
  const requestName = useMemo(() => {
    let name = "workScheduleTasks";
    if (workScheduleId) name += "-" + workScheduleId;
    if (startDate) name += "-" + startDate.toISOString();
    if (endDate) name += "-" + endDate.toISOString();
    if (acceptEqualDate) name += "-aed" + acceptEqualDate;
    if (activeOnly) name += "-ao" + activeOnly;
    return name;
  }, [acceptEqualDate, activeOnly, endDate, startDate, workScheduleId]);

  const { data: workScheduleTasks, mutate } = useSWR(requestName, () =>
    FetchWorkScheduleTasks(
      workScheduleId,
      startDate,
      endDate,
      acceptEqualDate,
      activeOnly
    )
  );

  return {
    workScheduleTasks: workScheduleTasks || [],
    mutate,
  };
}
