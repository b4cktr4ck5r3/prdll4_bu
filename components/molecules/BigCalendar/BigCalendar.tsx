import {
  ChevronLeft16,
  ChevronRight16,
  Filter16,
  View16,
} from "@carbon/icons-react";
import { BigCalendarExportButton } from "@components/molecules/BigCalendar/BigCalendarExportButton";
import { BigCalendarFilter } from "@components/molecules/BigCalendar/BigCalendarFilter";
import { useUserCalendarFilter, useUsersInfo } from "@hooks";
import { BigCalendarContext } from "@lib/contexts";
import { ActionIcon, Button, Group } from "@mantine/core";
import { useListState, useToggle } from "@mantine/hooks";
import { styled } from "@stitches";
import { CalendarFilter, CalendarView } from "@utils/calendar/Calendar";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { FC, useEffect, useMemo, useState } from "react";
import { BigCalendarDays } from "./BigCalendarDays";

export const BigCalendarSC = styled("div", {
  display: "flex",
  flexDirection: "column",
  ".date-label": {
    display: "block",
    fontSize: "$lg",
    fontWeight: "$bold",
    width: "170px",
    textAlign: "center",
  },
  ".date-label::first-letter": {
    textTransform: "uppercase",
  },
});

export const BigCalendar: FC = () => {
  const { users } = useUsersInfo();
  const { data: sessionData } = useSession();
  const { userCalendarFilter } = useUserCalendarFilter();
  const [excludedUsers, excludedUsersHandlers] = useListState<string>([]);
  const [excludedPlannings, excludedPlanningsHandlers] = useListState<string>(
    []
  );
  const [view, toggleView] = useToggle(CalendarView.MONTH, [
    CalendarView.WEEK,
    CalendarView.MONTH,
  ]);
  const [showFilter, toggleFilter] = useToggle(false, [false, true]);
  const currentDate = useMemo(() => dayjs().toDate(), []);
  const [dateSelected, setDateSelected] = useState(dayjs().toDate());
  const monthLabel = useMemo(
    () => dateSelected.toLocaleString("fr", { month: "long" }),
    [dateSelected]
  );

  useEffect(() => {
    if (userCalendarFilter === CalendarFilter.PERSONAL)
      excludedUsersHandlers.setState(
        users
          .map((user) => user.id)
          .filter((id) => id !== sessionData?.user?.sub)
      );
  }, [
    excludedUsersHandlers,
    sessionData?.user?.sub,
    userCalendarFilter,
    users,
  ]);

  return (
    <BigCalendarContext.Provider
      value={{
        view,
        currentDate,
        dateSelected,
        excludedPlannings,
        excludedUsers,
        excludedPlanningsHandlers,
        excludedUsersHandlers,
      }}
    >
      <BigCalendarSC>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => {
              setDateSelected((prevDate) => {
                if (view === CalendarView.MONTH)
                  return new Date(
                    prevDate.getFullYear(),
                    prevDate.getMonth() - 1,
                    1
                  );
                else
                  return new Date(
                    prevDate.getFullYear(),
                    prevDate.getMonth(),
                    prevDate.getDate() - prevDate.getDay() + 1 - 7
                  );
              });
            }}
          >
            <ChevronLeft16 />
          </ActionIcon>
          <span className="date-label">
            {view === CalendarView.WEEK
              ? dateSelected.getDate().toString() + " "
              : ""}
            {monthLabel} {dateSelected.getFullYear()}
          </span>
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => {
              setDateSelected((prevDate) => {
                if (view === CalendarView.MONTH)
                  return new Date(
                    prevDate.getFullYear(),
                    prevDate.getMonth() + 1,
                    1
                  );
                else
                  return new Date(
                    prevDate.getFullYear(),
                    prevDate.getMonth(),
                    prevDate.getDate() - prevDate.getDay() + 1 + 7
                  );
              });
            }}
          >
            <ChevronRight16 />
          </ActionIcon>
          <Group style={{ marginLeft: "auto" }}>
            <Button
              leftIcon={<View16 />}
              size="xs"
              variant="light"
              onClick={() => toggleView()}
            >
              {view === CalendarView.WEEK ? "Semaine" : "Mois"}
            </Button>
            <Button
              leftIcon={<Filter16 />}
              size="xs"
              variant="light"
              onClick={() => toggleFilter()}
            >
              Filtre
            </Button>
            <BigCalendarExportButton />
          </Group>
        </div>
        {showFilter ? <BigCalendarFilter /> : <BigCalendarDays />}
      </BigCalendarSC>
    </BigCalendarContext.Provider>
  );
};
