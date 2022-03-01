import {
  ChevronLeft16,
  ChevronRight16,
  Filter16,
  View16,
} from "@carbon/icons-react";
import { BigCalendarFilter } from "@components/molecules/BigCalendar/BigCalendarFilter";
import { BigCalendarContext } from "@lib/contexts";
import { ActionIcon, Button, Group } from "@mantine/core";
import { useListState, useToggle } from "@mantine/hooks";
import { styled } from "@stitches";
import { CalendarView } from "@utils/calendar/Calendar";
import { FC, useMemo, useState } from "react";
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
  const [excludedUsers, excludedUsersHandlers] = useListState<string>([]);
  const [excludedPlannings, excludedPlanningsHandlers] = useListState<string>(
    []
  );
  const [view, toggleView] = useToggle(CalendarView.WEEK, [
    CalendarView.WEEK,
    CalendarView.MONTH,
  ]);
  const [showFilter, toggleFilter] = useToggle(false, [false, true]);
  const currentDate = useMemo(() => new Date(), []);
  const [dateSelected, setDateSelected] = useState(new Date());
  const monthLabel = useMemo(
    () => dateSelected.toLocaleString("default", { month: "long" }),
    [dateSelected]
  );

  return (
    <BigCalendarContext.Provider
      value={{
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
          </Group>
        </div>

        {showFilter ? (
          <BigCalendarFilter />
        ) : (
          <BigCalendarDays
            currentDate={currentDate}
            dateSelected={dateSelected}
            view={view}
          />
        )}
      </BigCalendarSC>
    </BigCalendarContext.Provider>
  );
};
