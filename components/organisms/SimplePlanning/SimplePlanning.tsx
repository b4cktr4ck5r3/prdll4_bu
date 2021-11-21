import { BoxSC } from "@components/atoms";
import { MiniCalendar, MiniEvent, MiniEventSC } from "@components/molecules";
import { CalendarContext, PlanningContext } from "@lib/contexts";
import { useLocalStorageValue } from "@mantine/hooks";
import { styled } from "@stitches";
import {
  AllEventsSimplified,
  CompareDateToDateSimplified,
  Event,
  FormatDateString,
  GetDaysInMonth,
  InternalWorkEventDTO,
  InternalWorkEventSimplified,
  UnavailabilityEventDTO,
  UnavailabilityEventSimplified,
} from "@utils/calendar";
import { BooleanString, Preferences } from "@utils/user";
import axios from "axios";
import dayjs from "dayjs";
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
  minWidth: "$256",
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
  type?: "ALL" | Event;
};

export const SimplePlanning: FC<SimplePlanningProps> = ({ type = "ALL" }) => {
  const { refresh, setRefresh, synchronizedDate } = useContext(PlanningContext);
  const [syncCalendarForm] = useLocalStorageValue<BooleanString>({
    key: Preferences.SyncCalendarForm,
    defaultValue: "false",
  });
  const [dateSelected, setDateSelected] = useState(new Date());
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
      courses: [],
      internalWorks,
      unavailabilities,
    }),
    [internalWorks, unavailabilities]
  );

  const dayEvents = useMemo<AllEventsSimplified>(
    () => ({
      courses: [],
      unavailabilities: unavailabilities.filter(({ date }) =>
        CompareDateToDateSimplified(dateSelected, date)
      ),
      internalWorks: internalWorks.filter(({ date }) =>
        CompareDateToDateSimplified(dateSelected, date)
      ),
    }),
    [dateSelected, internalWorks, unavailabilities]
  );

  const dayEventsCount = useMemo(
    () =>
      dayEvents.courses.length +
      dayEvents.internalWorks.length +
      dayEvents.unavailabilities.length,
    [dayEvents]
  );

  const findInternalWorks = useCallback(() => {
    if (type === "ALL" || type === Event.InternalWork)
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
  }, [startDate, endDate, type]);

  const findUnavailabilities = useCallback(() => {
    if (type === "ALL" || type === Event.Unavailability)
      axios
        .get<UnavailabilityEventDTO[]>("/api/unavailability", {
          params: {
            startDate,
            endDate,
          },
        })
        .then(({ data }) =>
          setUnavailabilities(
            data.map<UnavailabilityEventSimplified>((props) => {
              const startDate = new Date(props.startDate);
              const endDate = new Date(props.endDate);
              return {
                ...props,
                startDate,
                endDate,
                date: {
                  date: startDate.getDate(),
                  month: startDate.getMonth(),
                  year: startDate.getFullYear(),
                },
              };
            })
          )
        );
  }, [startDate, endDate, type]);

  const refreshData = useCallback(() => {
    if (refresh) {
      setRefresh(false);
      findInternalWorks();
      findUnavailabilities();
    }
  }, [refresh, setRefresh, findInternalWorks, findUnavailabilities]);

  useEffect(() => {
    findInternalWorks();
    findUnavailabilities();
  }, [findInternalWorks, findUnavailabilities]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (syncCalendarForm === "true" && synchronizedDate)
      setDateSelected(synchronizedDate);
  }, [syncCalendarForm, synchronizedDate]);

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
        {dayEvents.unavailabilities.map(({ startDate, endDate }, i) => {
          const leftTime = dayjs(startDate).format("HH:mm");
          const rightTime = dayjs(endDate).format("HH:mm");
          return (
            <MiniEvent
              key={i}
              color="red"
              title={"Indisponibilité"}
              description={`${startDate.getDate()} ${startDate.toLocaleString(
                "default",
                { month: "long" }
              )} ${startDate.getFullYear()}`}
              infoLeft={[leftTime, rightTime]}
            />
          );
        })}
        {dayEventsCount === 0 && (
          <SimplePlanningNoEventSC>
            {"Pas d'événements"}
          </SimplePlanningNoEventSC>
        )}
      </SimplePlanningSC>
    </CalendarContext.Provider>
  );
};
