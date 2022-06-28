import { AllEventsSimplified, DateSimplified } from "@utils/calendar";
import dayjs from "dayjs";
import { createContext, Dispatch, SetStateAction } from "react";

export type CalendarContextProps = {
  allEvents: AllEventsSimplified;
  dateSelected: Date;
  setDateSelected: Dispatch<SetStateAction<Date>>;
  daysInMonth: DateSimplified[][];
};

export const CalendarContext = createContext<CalendarContextProps>({
  allEvents: {
    courses: [],
    internalWorks: [],
    unavailabilities: [],
  },
  daysInMonth: [],
  dateSelected: dayjs().toDate(),
  setDateSelected: () => null,
});
