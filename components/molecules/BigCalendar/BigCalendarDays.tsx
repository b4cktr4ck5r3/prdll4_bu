import useWorkScheduleTasks from "@hooks/useWorkScheduleTasks";
import { BigCalendarContext } from "@lib/contexts";
import { Text } from "@mantine/core";
import { styled } from "@stitches";
import {
  CompareDateToDateSimplified,
  GetActiveWeekIndex,
  GetAllDayNames,
  GetDaysInMonth,
} from "@utils/calendar";
import { CalendarView } from "@utils/calendar/Calendar";
import dayjs from "dayjs";
import { FC, useContext, useMemo } from "react";

const AllDayNames = GetAllDayNames();

export const BigCalendarDaysItemLabelSC = styled("span", {
  position: "absolute",
  top: "$8",
  left: "$4",
  fontWeight: "$bold",
  fontSize: "$2xl",
  borderRadius: "$full",
});
export const BigCalendarDaysItemSC = styled("div", {
  position: "relative",
  borderColor: "$neutral9",
  borderStyle: "$solid",
  borderTopWidth: "2px",
  minHeight: "$128",
  paddingLeft: "$4",
  paddingRight: "$4",
  paddingTop: "42px",
  marginBottom: "$8",
  ul: {
    color: "$neutral9",
  },
  li: {
    fontSize: "$sm",
  },
  "li + li": {
    marginTop: "$4",
  },
  variants: {
    active: {
      true: {
        borderColor: "$primary7",
        color: "$primary7",
      },
    },
  },
});
export const BigCalendarDaysTitleSC = styled("div", {
  textAlign: "center",
});

export const BigCalendarDaysSC = styled("div", {
  position: "relative",
  display: "grid",
  columnGap: "$12",
  rowGap: "5px",
  gridTemplateColumns: "repeat(7, 1fr)",
  gridTemplateRows: "repeat(auto-fill, max-content)",
  marginTop: "$12",
  color: "$neutral7",
});

export type BigCalendarDaysProps = {
  currentDate: Date;
  dateSelected: Date;
  view: CalendarView;
};

export const BigCalendarDays: FC<BigCalendarDaysProps> = ({
  currentDate,
  dateSelected,
  view,
}) => {
  const { excludedPlannings, excludedUsers } = useContext(BigCalendarContext);
  const allWeeksOfMonth = useMemo(
    () => GetDaysInMonth(dateSelected),
    [dateSelected]
  );
  const { startDate, endDate } = useMemo(() => {
    const firstDate = allWeeksOfMonth[0][0];
    const lastDate = allWeeksOfMonth[allWeeksOfMonth.length - 1][6];

    return {
      startDate: new Date(firstDate.year, firstDate.month, firstDate.date),
      endDate: new Date(lastDate.year, lastDate.month, lastDate.date),
    };
  }, [allWeeksOfMonth]);

  const { workScheduleTasks } = useWorkScheduleTasks({ startDate, endDate });

  return (
    <BigCalendarDaysSC>
      {AllDayNames.map((day) => (
        <BigCalendarDaysTitleSC key={day}>
          <span className="label">{day.substring(0, 3)}</span>
        </BigCalendarDaysTitleSC>
      ))}
      {allWeeksOfMonth
        .filter((_, i) =>
          view === CalendarView.MONTH
            ? true
            : i === GetActiveWeekIndex(dateSelected, allWeeksOfMonth)
        )
        .map((daysOfWeek) =>
          daysOfWeek.map((date) => {
            const tasks = workScheduleTasks
              .filter(({ startDate }) =>
                CompareDateToDateSimplified(new Date(startDate), date)
              )
              .sort(
                (a, b) =>
                  new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime() ||
                  new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
              );
            return (
              <BigCalendarDaysItemSC
                active={CompareDateToDateSimplified(currentDate, date)}
                key={JSON.stringify(date)}
              >
                <BigCalendarDaysItemLabelSC className="label">
                  {date.date.toString().padStart(2, "0")}
                </BigCalendarDaysItemLabelSC>
                <ul>
                  {tasks
                    .filter(
                      (task) =>
                        !excludedPlannings.includes(task.schedule.id) &&
                        !task.users.every(({ id }) =>
                          excludedUsers.includes(id)
                        )
                    )
                    .map(({ id, endDate, name, startDate, users }) => (
                      <li key={id}>
                        <Text
                          lineClamp={2}
                          size="xs"
                          weight="bold"
                          color="black"
                        >
                          {name}
                        </Text>
                        <Text color="gray" size="xs">
                          {`${dayjs(startDate).format("HH:mm")} - ${dayjs(
                            endDate
                          ).format("HH:mm")}`}
                        </Text>
                        {users.map((user) => (
                          <Text
                            key={user.id}
                            lineClamp={1}
                            color="gray"
                            size="xs"
                          >
                            {`${user.full_name}`}
                          </Text>
                        ))}
                      </li>
                    ))}
                </ul>
              </BigCalendarDaysItemSC>
            );
          })
        )}
    </BigCalendarDaysSC>
  );
};
