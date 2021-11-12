import { AllEventsSimplified, DateSimplified } from "@utils/calendar";
import { createContext, Dispatch, SetStateAction } from "react";

export type CalendarContextProps = {
  allEvents: AllEventsSimplified;
  dateSelected: Date;
  setDateSelected: Dispatch<SetStateAction<Date>>;
  daysInMonth: DateSimplified[][];
  refreshData: () => void;
};

export const CalendarContext = createContext<CalendarContextProps>({
  allEvents: {
    courses: [],
    internalWorks: [],
    unavailabilities: [],
  },
  daysInMonth: [],
  dateSelected: new Date(),
  setDateSelected: () => null,
  refreshData: () => null,
});
