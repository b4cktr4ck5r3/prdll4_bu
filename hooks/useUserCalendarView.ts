import { useLocalStorageValue } from "@mantine/hooks";
import { CalendarFilter } from "@utils/calendar/Calendar";
import { CalendarFilterString, Preferences } from "@utils/user";
import { useMemo } from "react";

export function useUserCalendarFilter() {
  const [userCalendarFilter, setUserCalendarFilter] =
    useLocalStorageValue<CalendarFilterString>({
      key: Preferences.UserCalendarFilter,
      defaultValue: "global",
    });

  const value = useMemo(() => {
    if (userCalendarFilter === "global") return CalendarFilter.GLOBAL;
    if (userCalendarFilter === "personal") return CalendarFilter.PERSONAL;
    else return CalendarFilter.GLOBAL;
  }, [userCalendarFilter]);

  return {
    userCalendarFilter: value,
    setUserCalendarFilter,
  };
}
