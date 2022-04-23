import FetchPlannings from "@lib/swr/fetchers/FetchPlannings";
import useSWR from "swr";

export function usePlannings() {
  const { data: plannings, mutate } = useSWR("plannings", FetchPlannings);

  return {
    plannings: plannings || [],
    mutate,
  };
}
