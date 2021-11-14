import { createContext, Dispatch, SetStateAction } from "react";

export type PlanningContextProps = {
  refresh: boolean;
  synchronizedDate: Date | null; // user pref
  setRefresh: Dispatch<SetStateAction<boolean>>;
  setSynchronizedDate: Dispatch<SetStateAction<Date>>;
};

export const PlanningContext = createContext<PlanningContextProps>({
  synchronizedDate: new Date(),
  refresh: false,
  setRefresh: () => null,
  setSynchronizedDate: () => null,
});
