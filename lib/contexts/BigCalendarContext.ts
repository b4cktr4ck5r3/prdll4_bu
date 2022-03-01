import { useListState } from "@mantine/hooks";
import { createContext } from "react";

export type BigCalendarContextProps = {
  excludedUsers: string[];
  excludedUsersHandlers?: ReturnType<typeof useListState>[1];
  excludedPlannings: string[];
  excludedPlanningsHandlers?: ReturnType<typeof useListState>[1];
};

export const BigCalendarContext = createContext<BigCalendarContextProps>({
  excludedUsers: [],
  excludedPlannings: [],
});
