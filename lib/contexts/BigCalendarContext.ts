import { useListState } from "@mantine/hooks";
import { CalendarView } from "@utils/calendar/Calendar";
import dayjs from "dayjs";
import { createContext } from "react";

export type BigCalendarContextProps = {
  view: CalendarView;
  currentDate: Date;
  dateSelected: Date;
  excludedUsers: string[];
  excludedUsersHandlers?: ReturnType<typeof useListState>[1];
  excludedPlannings: string[];
  excludedPlanningsHandlers?: ReturnType<typeof useListState>[1];
};

export const BigCalendarContext = createContext<BigCalendarContextProps>({
  view: CalendarView.WEEK,
  currentDate: dayjs().toDate(),
  dateSelected: dayjs().toDate(),
  excludedUsers: [],
  excludedPlannings: [],
});
