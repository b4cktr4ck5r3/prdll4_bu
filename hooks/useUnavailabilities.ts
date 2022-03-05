import FetchUnavailabilities from "@lib/swr/fetchers/FetchUnavailabilities";
import { useMemo } from "react";
import useSWR from "swr";

type Props = {
  startDate?: Date;
  endDate?: Date;
};

export default function useUnavailabilities({
  endDate,
  startDate,
}: Props = {}) {
  const requestName = useMemo(() => {
    let name = "unavailabilities";
    if (startDate) name += "-" + startDate.toISOString();
    if (endDate) name += "-" + endDate.toISOString();
    return name;
  }, [endDate, startDate]);

  const { data: unavailabilities, mutate } = useSWR(requestName, () =>
    FetchUnavailabilities(startDate, endDate)
  );

  return {
    unavailabilities: unavailabilities || [],
    mutate,
  };
}
