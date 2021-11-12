import { BoxSC } from "@components/atoms";
import { MiniCalendar, MiniEvent, MiniEventSC } from "@components/molecules";
import { CalendarContext, PlanningContext } from "@lib/contexts";
import { styled } from "@stitches";
import {
  AllEventsSimplified,
  CompareDateToDateSimplified,
  CourseEventSimplified,
  Event,
  FormatDateString,
  GetDaysInMonth,
  InternalWorkEventDTO,
  InternalWorkEventSimplified,
  UnavailabilityEventSimplified,
} from "@utils/calendar";
import axios from "axios";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const SimplePlanningNoEventSC = styled("div", {
  textAlign: "center",
  fontStyle: "italic",
});

export const SimplePlanningSC = styled("div", BoxSC, {
  width: "100%",
  maxWidth: "$384",
  ".title": {
    color: "$neutral9",
    marginTop: "$12",
    marginBottom: "$12",
    fontSize: "$xl",
    fontWeight: "$bold",
    textAlign: "center",
  },
  [`${MiniEventSC}`]: {
    position: "relative",
  },
  [`${MiniEventSC} ~ ${MiniEventSC}`]: {
    marginTop: "$12",
  },
  [`${MiniEventSC} ~ ${MiniEventSC}::before`]: {
    content: "''",
    position: "absolute",
    background: "$neutral4",
    top: "-6px",
    height: "$1",
    left: "$0",
    right: "$0",
  },
});

export type SimplePlanningProps = {
  type: "ALL" | Event;
};

export const SimplePlanning: FC = () => {
  const { refresh, setRefresh } = useContext(PlanningContext);
  const [dateSelected, setDateSelected] = useState(new Date());
  const [courses, setCourses] = useState<CourseEventSimplified[]>([]);
  const [internalWorks, setInternalWorks] = useState<
    InternalWorkEventSimplified[]
  >([]);
  const [unavailabilities, setUnavailabilities] = useState<
    UnavailabilityEventSimplified[]
  >([]);

  const daysInMonth = useMemo(
    () => GetDaysInMonth(dateSelected),
    [dateSelected]
  );
  const startDate = useMemo(
    () => FormatDateString(daysInMonth[0][0]),
    [daysInMonth]
  );
  const endDate = useMemo(
    () => FormatDateString(daysInMonth[daysInMonth.length - 1][6]),
    [daysInMonth]
  );

  const allEvents = useMemo<AllEventsSimplified>(
    () => ({
      courses,
      internalWorks,
      unavailabilities,
    }),
    [courses, internalWorks, unavailabilities]
  );

  const dayEvents = useMemo<AllEventsSimplified>(
    () => ({
      courses: [],
      unavailabilities: [],
      internalWorks: internalWorks.filter(({ date }) =>
        CompareDateToDateSimplified(dateSelected, date)
      ),
    }),
    [dateSelected, internalWorks]
  );

  const dayEventsCount = useMemo(
    () =>
      dayEvents.courses.length +
      dayEvents.internalWorks.length +
      dayEvents.unavailabilities.length,
    [dayEvents]
  );

  const findInternalWorks = useCallback(() => {
    axios
      .get<InternalWorkEventDTO[]>("/api/internalWork", {
        params: {
          startDate,
          endDate,
        },
      })
      .then(({ data }) =>
        setInternalWorks(
          data.map<InternalWorkEventSimplified>((props) => {
            const date = new Date(props.date);
            return {
              ...props,
              date: {
                date: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
              },
            };
          })
        )
      );
  }, [startDate, endDate]);

  const refreshData = useCallback(() => {
    if (refresh) {
      setRefresh(false);
      findInternalWorks();
    }
  }, [refresh, setRefresh, findInternalWorks]);

  useEffect(() => {
    findInternalWorks();
  }, [findInternalWorks]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <CalendarContext.Provider
      value={{
        allEvents,
        daysInMonth,
        dateSelected,
        setDateSelected,
        refreshData,
      }}
    >
      <SimplePlanningSC>
        <MiniCalendar />
        <div className="title">Agenda du jour</div>
        {dayEvents.internalWorks.map(({ duration, description }, i) => (
          <MiniEvent
            key={i}
            title={"Travail Interne"}
            description={description || "Sans description"}
            infoLeft={`${duration}h`}
          />
        ))}
        {dayEventsCount === 0 && (
          <SimplePlanningNoEventSC>
            {"Pas d'événements"}
          </SimplePlanningNoEventSC>
        )}
      </SimplePlanningSC>
    </CalendarContext.Provider>
  );
};
