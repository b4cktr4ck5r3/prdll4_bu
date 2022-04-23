import FetchUnavailabilities from "@lib/swr/fetchers/FetchUnavailabilities";
import { useMemo } from "react";
import useSWR from "swr";

type Props = {
  startDate?: Date;
  endDate?: Date;
  acceptEqualDate?: boolean;
};

export function useUnavailabilities({
  endDate,
  startDate,
  acceptEqualDate,
}: Props = {}) {
  const requestName = useMemo(() => {
    let name = "unavailabilities";
    if (startDate) name += "-" + startDate.toISOString();
    if (endDate) name += "-" + endDate.toISOString();
    if (acceptEqualDate) name += "-" + acceptEqualDate;
    return name;
  }, [acceptEqualDate, endDate, startDate]);

  const { data: unavailabilities, mutate } = useSWR(requestName, () =>
    FetchUnavailabilities(startDate, endDate, acceptEqualDate)
  );

  return {
    unavailabilities: unavailabilities || [],
    mutate,
  };
}
