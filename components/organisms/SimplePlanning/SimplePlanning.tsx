import { BoxSC } from "@components/atoms";
import { MiniCalendar, MiniEvent, MiniEventSC } from "@components/molecules";
import { InternalWorkFormType } from "@data/form";
import { UnavailabilityFormType } from "@data/form/unavailability";
import useSyncCalendarForm from "@hooks/useSyncCalendarForm";
import useUsersInfo from "@hooks/useUsersInfo";
import { CalendarContext, PlanningContext } from "@lib/contexts";
import { Text } from "@mantine/core";
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
import { UnavailabilityItemForm } from "@utils/unavailability";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React, {
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
  onDeleteEvent?: () => void;
  onEditEvent?: () => void;
};

type SimplePlanningHandle = {
  refresh: () => void;
};

const SimplePlanningComponent: React.ForwardRefRenderFunction<
  SimplePlanningHandle,
  SimplePlanningProps
> = ({ type = "ALL", onDeleteEvent, onEditEvent }, forwardedRef) => {
  const { data: sessionData } = useSession();
  React.useImperativeHandle(forwardedRef, () => ({
    refresh() {
      if (type === Event.InternalWork) {
        findInternalWorks();
      } else if (type === Event.Unavailability) {
        findUnavailabilities();
      }
    },
  }));
  const { synchronizedDate } = useContext(PlanningContext);
  const { syncCalendarForm } = useSyncCalendarForm();
  const [dateSelected, setDateSelected] = useState(new Date());
  const [internalWorks, setInternalWorks] = useState<
    InternalWorkEventSimplified[]
  >([]);
  const [unavailabilities, setUnavailabilities] = useState<
    UnavailabilityEventSimplified[]
  >([]);
  const { users } = useUsersInfo();

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
        .get<InternalWorkEventDTO[]>(`/api/internalWork`, {
          params: {
            userId: sessionData?.user?.sub,
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
  }, [type, sessionData?.user?.sub, startDate, endDate]);

  const findUnavailabilities = useCallback(() => {
    if (type === "ALL" || type === Event.Unavailability)
      axios
        .get<UnavailabilityEventDTO[]>(`/api/unavailability`, {
          params: {
            userId: sessionData?.user?.sub,
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
  }, [type, sessionData?.user?.sub, startDate, endDate]);

  const deleteInternalWork = useCallback(
    (eventId: string) => {
      if (type === Event.InternalWork) {
        axios.delete(`/api/internalWork/${eventId}`).then(onDeleteEvent);
      }
    },
    [onDeleteEvent, type]
  );

  const updateInternalWork = useCallback(
    (eventId: string, data: InternalWorkFormType) => {
      if (type === Event.InternalWork) {
        axios.put(`/api/internalWork/${eventId}`, data).then(onEditEvent);
      }
    },
    [onEditEvent, type]
  );

  const deleteUnavailability = useCallback(
    (eventId: string) => {
      if (type === Event.Unavailability) {
        axios.delete(`/api/unavailability/${eventId}`).then(onDeleteEvent);
      }
    },
    [onDeleteEvent, type]
  );

  const updateUnavailability = useCallback(
    (eventId: string, data: UnavailabilityItemForm) => {
      if (type === Event.Unavailability) {
        axios.put(`/api/unavailability/${eventId}`, data).then(onEditEvent);
      }
    },
    [onEditEvent, type]
  );

  useEffect(() => {
    findInternalWorks();
    findUnavailabilities();
  }, [findInternalWorks, findUnavailabilities]);

  useEffect(() => {
    if (syncCalendarForm && synchronizedDate) setDateSelected(synchronizedDate);
  }, [syncCalendarForm, synchronizedDate]);

  return (
    <CalendarContext.Provider
      value={{
        allEvents,
        daysInMonth,
        dateSelected,
        setDateSelected,
      }}
    >
      <SimplePlanningSC>
        <MiniCalendar />
        <div className="title">Agenda du jour</div>
        {dayEvents.internalWorks.map((event, i) => {
          const { id, duration, description, status } = event;
          return (
            <MiniEvent
              key={i}
              event={event}
              title={"Travail Interne"}
              description={
                <>
                  <Text>
                    {(description || "Sans description") +
                      `\n${
                        "@" +
                          users.find((e) => e.id === event.userId)?.full_name ||
                        "_Inconnu_"
                      }`}
                  </Text>
                  <Text
                    color={
                      status ? (status.validated ? "green" : "red") : "orange"
                    }
                    weight={"bold"}
                  >
                    {status
                      ? status.validated
                        ? "Validé"
                        : "Annulé"
                      : "En attente"}
                  </Text>
                </>
              }
              infoLeft={`${duration}h`}
              onDelete={() => deleteInternalWork(id)}
              onEdit={(data) =>
                updateInternalWork(id, data as InternalWorkFormType)
              }
              allowEdit={!status}
              type={Event.InternalWork}
            />
          );
        })}
        {dayEvents.unavailabilities.map((event, i) => {
          const { id, startDate, endDate } = event;
          const leftTime = dayjs(startDate).format("HH:mm");
          const rightTime = dayjs(endDate).format("HH:mm");
          return (
            <MiniEvent
              key={i}
              event={event}
              color="red"
              title={"Indisponibilité"}
              description={`${startDate.getDate()} ${startDate.toLocaleString(
                "fr",
                { month: "long" }
              )} ${startDate.getFullYear()}\n${
                "@" + users.find((e) => e.id === event.userId)?.full_name ||
                "_Inconnu_"
              }`}
              infoLeft={[leftTime, rightTime]}
              onDelete={() => deleteUnavailability(id)}
              onEdit={({
                date,
                time: [startDate, endDate],
              }: UnavailabilityFormType) => {
                const start = dayjs(date)
                  .second(0)
                  .minute(startDate.getMinutes())
                  .hour(startDate.getHours());

                const end = dayjs(date)
                  .second(0)
                  .minute(endDate.getMinutes())
                  .hour(endDate.getHours());

                updateUnavailability(id, {
                  startDate: start.toDate(),
                  endDate: end.toDate(),
                });
              }}
              allowEdit={new Date().getTime() < new Date(startDate).getTime()}
              type={Event.Unavailability}
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

export const SimplePlanning = React.forwardRef(SimplePlanningComponent);
