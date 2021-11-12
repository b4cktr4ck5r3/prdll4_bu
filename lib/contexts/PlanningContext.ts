import { createContext, Dispatch, SetStateAction } from "react";

export type PlanningContextProps = {
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
};

export const PlanningContext = createContext<PlanningContextProps>({
  refresh: false,
  setRefresh: () => null,
});
