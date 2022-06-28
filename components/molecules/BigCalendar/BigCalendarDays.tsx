import { BigCalendarModal } from "@components/molecules/BigCalendar/BigCalendarModal";
import {
  useHideWeekEnd,
  useUnavailabilities,
  useWorkScheduleTasks,
} from "@hooks";
import { BigCalendarContext } from "@lib/contexts";
import { Text } from "@mantine/core";
import { styled } from "@stitches";
import {
  CompareDateToDateSimplified,
  DateSimplified,
  GetActiveWeekIndex,
  GetAllDayNames,
  GetDaysInMonth,
} from "@utils/calendar";
import { CalendarView } from "@utils/calendar/Calendar";
import dayjs from "dayjs";
import { FC, useContext, useMemo, useState } from "react";

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
  cursor: "pointer",
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
  variants: {
    hideWeekEnd: {
      true: {
        gridTemplateColumns: "repeat(5, 1fr)",
      },
    },
  },
});

export const BigCalendarDays: FC = () => {
  const { hideWeekEnd } = useHideWeekEnd();
  const { currentDate, dateSelected, view } = useContext(BigCalendarContext);
  const [modalDate, setModalDate] = useState<DateSimplified>();
  const { excludedPlannings, excludedUsers } = useContext(BigCalendarContext);
  const allWeeksOfMonth = useMemo(
    () => GetDaysInMonth(dateSelected),
    [dateSelected]
  );
  const { startDate, endDate } = useMemo(() => {
    const firstDate = allWeeksOfMonth[0][0];
    const lastDate = allWeeksOfMonth[allWeeksOfMonth.length - 1][6];

    const start = dayjs()
      .year(firstDate.year)
      .month(firstDate.month)
      .date(firstDate.date)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    const end = dayjs()
      .year(lastDate.year)
      .month(lastDate.month)
      .date(lastDate.date)
      .hour(23)
      .minute(59)
      .second(59)
      .millisecond(999);

    return {
      startDate: start.toDate(),
      endDate: end.toDate(),
    };
  }, [allWeeksOfMonth]);

  const { workScheduleTasks } = useWorkScheduleTasks({ startDate, endDate });
  const { unavailabilities } = useUnavailabilities({
    startDate,
    endDate,
    acceptEqualDate: true,
  });

  const modalWorkScheduleTasks = useMemo(() => {
    if (modalDate)
      return workScheduleTasks.filter(({ startDate }) =>
        CompareDateToDateSimplified(dayjs(startDate).toDate(), modalDate)
      );
  }, [modalDate, workScheduleTasks]);

  const modalUnavailabilities = useMemo(() => {
    if (modalDate)
      return unavailabilities.filter(({ startDate }) =>
        CompareDateToDateSimplified(dayjs(startDate).toDate(), modalDate)
      );
  }, [modalDate, unavailabilities]);

  const daysPerRow = useMemo(() => (hideWeekEnd ? 5 : 7), [hideWeekEnd]);

  return (
    <BigCalendarDaysSC hideWeekEnd={hideWeekEnd}>
      {AllDayNames.slice(0, daysPerRow).map((day) => (
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
          daysOfWeek.slice(0, daysPerRow).map((date) => {
            const dayTasks = workScheduleTasks.filter(({ startDate }) =>
              CompareDateToDateSimplified(dayjs(startDate).toDate(), date)
            );
            const dayUnavailabilities = unavailabilities.filter(
              ({ startDate, user }) =>
                CompareDateToDateSimplified(dayjs(startDate).toDate(), date) &&
                !excludedUsers.includes(user.id)
            );
            return (
              <BigCalendarDaysItemSC
                active={CompareDateToDateSimplified(currentDate, date)}
                key={JSON.stringify(date)}
                onClick={() => setModalDate(date)}
              >
                <BigCalendarDaysItemLabelSC className="label">
                  {date.date.toString().padStart(2, "0")}
                </BigCalendarDaysItemLabelSC>
                <ul>
                  {dayTasks
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
                            {`@${user.full_name}`}
                          </Text>
                        ))}
                      </li>
                    ))}
                  {dayUnavailabilities.length > 0 && (
                    <li>
                      <Text size="xs" weight="bold" color="black">
                        {dayUnavailabilities.length} indisponibilité(s)
                      </Text>
                    </li>
                  )}
                </ul>
              </BigCalendarDaysItemSC>
            );
          })
        )}
      <BigCalendarModal
        date={modalDate}
        onClose={() => setModalDate(undefined)}
        workScheduleTasks={modalWorkScheduleTasks}
        unavailabilities={modalUnavailabilities}
      />
    </BigCalendarDaysSC>
  );
};
