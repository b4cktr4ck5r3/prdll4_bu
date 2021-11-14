import { ChevronLeft16, ChevronRight16 } from "@carbon/icons-react";
import { CalendarContext, PlanningContext } from "@lib/contexts";
import { CSS, styled } from "@stitches";
import {
  CompareDateSimplified,
  DateSimplified,
  GetActiveWeekIndex,
  GetAllDayNames,
  GetMonthLabel,
} from "@utils/calendar";
import { FC, useCallback, useContext, useMemo } from "react";

const AllDayNames = GetAllDayNames();

export const MiniCalendarMonthSC = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "$neutral7",
  lineHeight: 1.2,
  ".icon": {
    position: "absolute",
    top: "7px",
    cursor: "pointer",
  },
  ".left.icon": {
    left: "-25px",
  },
  ".right.icon": {
    right: "-25px",
  },
  ".label": {
    userSelect: "none",
    position: "relative",
    width: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  ".month": {
    color: "$primary7",
    fontSize: "$xl",
  },
  ".month::first-letter": {
    textTransform: "uppercase",
  },
});

export const MiniCalendarDaysSC = styled("div", {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  marginTop: "$12",
  color: "$neutral7",
});

export const MiniCalendarDaysItemSC = styled("div", {
  color: "$neutral7",
  textAlign: "center",
  position: "relative",
  height: "$32",
  borderRadius: "$lg",
  ".dots": {
    display: "flex",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "3px",
  },
  ".dot": {
    background: "$primary7",
    height: "$4",
    width: "$4",
    borderRadius: "$full",
  },
  ".dot + .dot": {
    marginLeft: "$2",
  },
  ".label": {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  variants: {
    cursor: {
      pointer: {
        cursor: "pointer",
      },
    },
    active: {
      true: {
        backgroundColor: "$primary7",
        color: "$white",
        ".dot": {
          background: "$white",
        },
      },
    },
    greyed: {
      true: {
        color: "$neutral4",
      },
    },
  },
});

export const MiniCalendarActiveWeekBgSC = styled("div", {
  position: "absolute",
  left: "0",
  right: "0",
  background: "$primary1",
  borderRadius: "$lg",
  height: "$32",
});

export const MiniCalendarSC = styled("div", {
  fontFamily: "$main",
});

export type MiniCalendarProps = {
  css?: CSS;
};

type AllDateItemsType = { date: DateSimplified; count: number }[];

export const MiniCalendar: FC<MiniCalendarProps> = ({ css }) => {
  const { setSynchronizedDate } = useContext(PlanningContext);
  const { allEvents, daysInMonth, dateSelected, setDateSelected } =
    useContext(CalendarContext);

  const allDateItems = useMemo(() => {
    return allEvents.courses
      .map((e) => e.date)
      .concat(allEvents.internalWorks.map((e) => e.date))
      .concat(allEvents.unavailabilities.map((e) => e.date))
      .reduce<AllDateItemsType>((acc, date) => {
        let item = acc.find((e) => CompareDateSimplified(date, e.date));
        if (!item) {
          item = { date, count: 0 };
          acc.push(item);
        }
        item.count += 1;
        return acc;
      }, []);
  }, [allEvents]);

  const monthLabel = useMemo(() => GetMonthLabel(dateSelected), [dateSelected]);
  const activeWeekIndex = useMemo(
    () => GetActiveWeekIndex(dateSelected, daysInMonth),
    [dateSelected, daysInMonth]
  );

  const changeDate = useCallback(
    (date: Date) => {
      setDateSelected(date);
      setSynchronizedDate(date);
    },
    [setDateSelected, setSynchronizedDate]
  );

  return (
    <MiniCalendarSC css={css}>
      <MiniCalendarMonthSC>
        <div className="label">
          <ChevronLeft16
            className="left icon"
            onClick={() =>
              changeDate(
                new Date(
                  dateSelected.getFullYear(),
                  dateSelected.getMonth() - 1,
                  1
                )
              )
            }
          />
          <ChevronRight16
            className="right icon"
            onClick={() =>
              changeDate(
                new Date(
                  dateSelected.getFullYear(),
                  dateSelected.getMonth() + 1,
                  1
                )
              )
            }
          />
          <span className="month">{monthLabel}</span>
          <span>{dateSelected.getFullYear()}</span>
        </div>
      </MiniCalendarMonthSC>
      <MiniCalendarDaysSC>
        <MiniCalendarActiveWeekBgSC
          css={{ top: `${32 * (activeWeekIndex + 1)}px` }}
        />
        {AllDayNames.map((day) => (
          <MiniCalendarDaysItemSC key={day}>
            <span className="label">{day.substring(0, 3)}</span>
          </MiniCalendarDaysItemSC>
        ))}
        {daysInMonth.map((week) =>
          week.map(({ date, month, year }) => {
            const nbDots =
              allDateItems.find((e) =>
                CompareDateSimplified(e.date, { date, month, year })
              )?.count || 0;
            return (
              <MiniCalendarDaysItemSC
                active={
                  date === dateSelected.getDate() &&
                  month === dateSelected.getMonth()
                }
                cursor="pointer"
                greyed={month !== dateSelected.getMonth()}
                key={date}
                onClick={() => changeDate(new Date(year, month, date))}
              >
                <span className="label">{date}</span>
                <div className="dots">
                  {Array.from(
                    {
                      length: Math.min(nbDots, 4),
                    },
                    (_, i) => (
                      <div key={i} className="dot" />
                    )
                  )}
                </div>
              </MiniCalendarDaysItemSC>
            );
          })
        )}
      </MiniCalendarDaysSC>
    </MiniCalendarSC>
  );
};
