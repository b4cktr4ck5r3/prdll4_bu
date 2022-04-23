import FetchTimeReports from "@lib/swr/fetchers/FetchTimeReports";
import { useMemo } from "react";
import useSWR from "swr";

type Props = {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
};

export function useTimeReports({ userId, endDate, startDate }: Props = {}) {
  const requestName = useMemo(() => {
    let name = "timeReports";
    if (userId) name += "-" + userId;
    if (startDate) name += "-" + startDate.toISOString();
    if (endDate) name += "-" + endDate.toISOString();
    return name;
  }, [endDate, startDate, userId]);

  const { data: timeReports, mutate } = useSWR(requestName, () =>
    FetchTimeReports(userId, startDate, endDate)
  );

  return {
    timeReports: timeReports || [],
    mutate,
  };
}
