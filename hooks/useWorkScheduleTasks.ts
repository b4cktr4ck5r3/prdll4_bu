import FetchWorkScheduleTasks from "@lib/swr/fetchers/FetchWorkScheduleTasks";
import { useMemo } from "react";
import useSWR from "swr";

type Props = {
  workScheduleId?: string;
  startDate?: Date;
  endDate?: Date;
  acceptEqualDate?: boolean;
};

export default function useWorkScheduleTasks({
  workScheduleId,
  endDate,
  startDate,
  acceptEqualDate,
}: Props = {}) {
  const requestName = useMemo(() => {
    let name = "workScheduleTasks";
    if (workScheduleId) name += "-" + workScheduleId;
    if (startDate) name += "-" + startDate.toISOString();
    if (endDate) name += "-" + endDate.toISOString();
    if (acceptEqualDate) name += "-" + acceptEqualDate;
    return name;
  }, [acceptEqualDate, endDate, startDate, workScheduleId]);

  const { data: workScheduleTasks, mutate } = useSWR(requestName, () =>
    FetchWorkScheduleTasks(workScheduleId, startDate, endDate, acceptEqualDate)
  );

  return {
    workScheduleTasks: workScheduleTasks || [],
    mutate,
  };
}
