import FetchInternalWorks from "@lib/swr/fetchers/FetchInternalWorks";
import { useMemo } from "react";
import useSWR from "swr";

type Props = {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  validated?: boolean;
  withoutStatus?: boolean;
};

export function useInternalWorks({
  endDate,
  startDate,
  userId,
  validated,
  withoutStatus,
}: Props = {}) {
  const requestName = useMemo(() => {
    let name = "internalWorks";
    if (startDate) name += "-" + startDate.toISOString();
    if (endDate) name += "-" + endDate.toISOString();
    if (userId) name += "-uid" + userId;
    if (typeof validated === "boolean") name += "-v" + validated;
    if (typeof withoutStatus === "boolean") name += "-w" + withoutStatus;
    return name;
  }, [endDate, startDate, userId, validated, withoutStatus]);

  const { data: internalWorks, mutate } = useSWR(requestName, () =>
    FetchInternalWorks(startDate, endDate, userId, validated, withoutStatus)
  );

  return {
    internalWorks: internalWorks || [],
    mutate,
  };
}
