import FetchPlannings from "@lib/swr/fetchers/FetchPlannings";
import { useMemo } from "react";
import useSWR from "swr";

type Props = {
  hidden?: boolean;
};

export function usePlannings({ hidden }: Props = {}) {
  const requestName = useMemo(() => {
    let name = "plannings";
    if (hidden) name += "-" + hidden;
    return name;
  }, [hidden]);

  const { data: plannings, mutate } = useSWR(requestName, () =>
    FetchPlannings(hidden)
  );

  return {
    plannings: plannings || [],
    mutate,
  };
}
