import { ChevronLeft16, ChevronRight16, Filter16 } from "@carbon/icons-react";
import { ActionIcon, Button } from "@mantine/core";
import { styled } from "@stitches";
import { FC, useMemo, useState } from "react";
import { BigCalendarDays } from "./BigCalendarDays";

export const BigCalendarSC = styled("div", {
  display: "flex",
  flexDirection: "column",
  ".date-label": {
    display: "block",
    fontSize: "$lg",
    fontWeight: "$bold",
    width: "155px",
    textAlign: "center",
  },
  ".date-label::first-letter": {
    textTransform: "uppercase",
  },
});

export const BigCalendar: FC = () => {
  const currentDate = useMemo(() => new Date(), []);
  const [dateSelected, setDateSelected] = useState(new Date());
  const monthLabel = useMemo(
    () => dateSelected.toLocaleString("default", { month: "long" }),
    [dateSelected]
  );

  return (
    <BigCalendarSC>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => {
            setDateSelected((prevDate) => {
              const newDate = new Date(
                prevDate.getFullYear(),
                prevDate.getMonth() - 1,
                1
              );
              return newDate;
            });
          }}
        >
          <ChevronLeft16 />
        </ActionIcon>
        <span className="date-label">
          {monthLabel} {dateSelected.getFullYear()}
        </span>
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => {
            setDateSelected((prevDate) => {
              const newDate = new Date(
                prevDate.getFullYear(),
                prevDate.getMonth() + 1,
                1
              );
              return newDate;
            });
          }}
        >
          <ChevronRight16 />
        </ActionIcon>
        <Button
          leftIcon={<Filter16 />}
          style={{ marginLeft: "auto" }}
          size="xs"
          variant="light"
        >
          Filtre
        </Button>
      </div>
      <BigCalendarDays currentDate={currentDate} dateSelected={dateSelected} />
    </BigCalendarSC>
  );
};
