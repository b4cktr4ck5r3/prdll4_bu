import { Text } from "@mantine/core";
import { styled } from "@stitches";
import {
  GetActiveWeekIndex,
  GetAllDayNames,
  GetDaysInMonth,
} from "@utils/calendar";
import { FC, useMemo } from "react";

const AllDayNames = GetAllDayNames();

export const BigCalendarDaysItemLabelSC = styled("span", {
  position: "absolute",
  top: "$8",
  left: "$8",
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
  paddingLeft: "$8",
  paddingTop: "40px",
  ul: {
    color: "$neutral9",
  },
  li: {
    fontSize: "$sm",
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
};

export const BigCalendarDays: FC<BigCalendarDaysProps> = ({
  currentDate,
  dateSelected,
}) => {
  const daysInWeek = useMemo(
    () =>
      GetDaysInMonth(dateSelected)[
        GetActiveWeekIndex(dateSelected, GetDaysInMonth(dateSelected))
      ],
    [dateSelected]
  );

  return (
    <BigCalendarDaysSC>
      {AllDayNames.map((day) => (
        <BigCalendarDaysTitleSC key={day}>
          <span className="label">{day.substring(0, 3)}</span>
        </BigCalendarDaysTitleSC>
      ))}
      {daysInWeek.map(({ date, month }) => (
        <BigCalendarDaysItemSC
          active={
            date === currentDate.getDate() && month === currentDate.getMonth()
          }
          key={date}
        >
          <BigCalendarDaysItemLabelSC className="label">
            {date.toString().padStart(2, "0")}
          </BigCalendarDaysItemLabelSC>
          {date % 7 === 4 && month === currentDate.getMonth() && (
            <ul>
              <li>
                <Text lineClamp={2} size="xs" weight="bold" color="black">
                  {"Sécurité des systèmes d'informations"}
                </Text>
                <Text color="gray" size="xs">
                  {"8:30 - 9:30"}
                </Text>
              </li>
              <li style={{ marginTop: "8px" }}>
                <Text lineClamp={2} size="xs" weight="bold" color="black">
                  {"Sécurité des systèmes d'informations"}
                </Text>
                <Text color="gray" size="xs">
                  {"10:30 - 11:30"}
                </Text>
              </li>
              <li style={{ marginTop: "4px" }}>
                <Text lineClamp={2} size="xs" weight="bold" color="">
                  {"+3 séances"}
                </Text>
              </li>
            </ul>
          )}
        </BigCalendarDaysItemSC>
      ))}
    </BigCalendarDaysSC>
  );
};
