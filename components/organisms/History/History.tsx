import { BoxSC } from "@components/atoms";
import { MiniEvent } from "@components/molecules";
import { InternalWorkFormType } from "@data/form";
import { UnavailabilityFormType } from "@data/form/unavailability";
import { Text } from "@mantine/core";
import { styled } from "@stitches/react";
import {
  Event,
  InternalWorkEventDTO,
  InternalWorkEventSimplified,
  UnavailabilityEventDTO,
  UnavailabilityEventSimplified,
} from "@utils/calendar";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";

export const HistorySC = styled("div", BoxSC, {
  marginBottom: "$128",
  width: "100%",
  ".title": {
    color: "$neutral9",
    marginTop: "$12",
    marginBottom: "$12",
    fontSize: "$xl",
    fontWeight: "$bold",
    textAlign: "center",
  },
  maxWidth: "$384",
  minWidth: "$256",
  "& > * + *": {
    marginTop: "$16",
  },
});

type HistoryProps = {
  type: Event;
  onDeleteEvent: () => void;
  onEditEvent: () => void;
};

type HistoryHandle = {
  refresh: () => void;
};

const HistoryComponent: React.ForwardRefRenderFunction<
  HistoryHandle,
  HistoryProps
> = ({ type, onDeleteEvent, onEditEvent }, forwardedRef) => {
  const { data: sessionData } = useSession();

  React.useImperativeHandle(forwardedRef, () => ({
    refresh() {
      refreshData();
    },
  }));

  const [items, setItems] = useState<
    InternalWorkEventSimplified[] | UnavailabilityEventSimplified[]
  >([]);

  const findInternalWorks = useCallback(() => {
    if (type === Event.InternalWork) {
      axios
        .get<InternalWorkEventDTO[]>(`/api/internalWork`, {
          params: { userId: sessionData?.user?.sub },
        })
        .then(({ data }) => {
          setItems(
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
          );
        });
    }
  }, [sessionData?.user?.sub, type]);

  const findUnavailabilities = useCallback(() => {
    if (type === Event.Unavailability)
      axios
        .get<UnavailabilityEventDTO[]>(`/api/unavailability`, {
          params: {
            userId: sessionData?.user?.sub,
          },
        })
        .then(({ data }) => {
          setItems(
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
          );
        });
  }, [sessionData?.user?.sub, type]);

  const refreshData = useCallback(() => {
    if (type === Event.InternalWork) {
      findInternalWorks();
    } else if (type === Event.Unavailability) {
      findUnavailabilities();
    }
  }, [findInternalWorks, findUnavailabilities, type]);

  useEffect(refreshData, [refreshData]);

  const deleteEvent = useCallback(
    (eventId: string) => {
      let url = "";
      if (type === Event.InternalWork) {
        url = `/api/internalWork/${eventId}`;
      } else if (type === Event.Unavailability) {
        url = `/api/unavailability/${eventId}`;
      }

      axios.delete(url).then(onDeleteEvent);
    },
    [onDeleteEvent, type]
  );

  const updateEvent = useCallback(
    (eventId: string, data: InternalWorkFormType | UnavailabilityFormType) => {
      if (type === Event.InternalWork) {
        axios.put(`/api/internalWork/${eventId}`, data).then(onEditEvent);
      } else if (type === Event.Unavailability) {
        const { time } = data as UnavailabilityFormType;
        axios
          .put(`/api/unavailability/${eventId}`, {
            startDate: time[0],
            endDate: time[1],
          })
          .then(onEditEvent);
      }
    },
    [onEditEvent, type]
  );

  return (
    <HistorySC>
      <div className="title">Mon historique</div>
      {type === Event.InternalWork &&
        (items as InternalWorkEventSimplified[]).map((event, i) => {
          const { id, date, duration, status } = event;
          const dateObject = new Date(date.year, date.month, date.date);
          return (
            <MiniEvent
              key={i}
              event={event}
              title={`${dateObject.getDate()} ${dateObject.toLocaleString(
                "fr",
                { month: "long" }
              )} ${dateObject.getFullYear()}`}
              description={
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
              }
              infoLeft={`${duration.toFixed(2)}h`}
              onDelete={() => deleteEvent(id)}
              onEdit={(data) => updateEvent(id, data)}
              allowEdit={!status}
              type={type}
            />
          );
        })}
      {type === Event.Unavailability &&
        (items as UnavailabilityEventSimplified[]).map((event, i) => {
          const { id, startDate, endDate } = event;
          const leftTime = dayjs(startDate).format("HH:mm");
          const rightTime = dayjs(endDate).format("HH:mm");
          return (
            <MiniEvent
              key={i}
              event={event}
              color="red"
              title={`${startDate.getDate()} ${startDate.toLocaleString("fr", {
                month: "long",
              })} ${startDate.getFullYear()}`}
              description={""}
              infoLeft={[leftTime, rightTime]}
              onDelete={() => deleteEvent(id)}
              onEdit={(data) => updateEvent(id, data)}
              allowEdit={new Date().getTime() < new Date(startDate).getTime()}
              type={type}
            />
          );
        })}
    </HistorySC>
  );
};

export const History = React.forwardRef(HistoryComponent);
