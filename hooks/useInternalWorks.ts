import FetchInternalWorks from "@lib/swr/fetchers/FetchInternalWorks";
import { useMemo } from "react";
import useSWR from "swr";

type Props = {
  startDate?: Date;
  endDate?: Date;
  validated?: boolean;
};

export default function useInternalWorks({
  endDate,
  startDate,
  validated,
}: Props = {}) {
  const requestName = useMemo(() => {
    let name = "internalWorks";
    if (startDate) name += "-" + startDate.toISOString();
    if (endDate) name += "-" + endDate.toISOString();
    if (typeof validated === "boolean") name += "-" + validated;
    return name;
  }, [endDate, startDate, validated]);

  const { data: internalWorks, mutate } = useSWR(requestName, () =>
    FetchInternalWorks(startDate, endDate, validated)
  );

  return {
    internalWorks: internalWorks || [],
    mutate,
  };
}
