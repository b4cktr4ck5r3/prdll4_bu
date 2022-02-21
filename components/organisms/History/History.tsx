import { BoxSC } from "@components/atoms";
import { MiniEvent } from "@components/molecules";
import { styled } from "@stitches/react";
import { Event, InternalWorkEventDTO, InternalWorkEventSimplified, UnavailabilityEventDTO, UnavailabilityEventSimplified} from "@utils/calendar"
import axios from "axios";
import dayjs from "dayjs";
import React from "react";
import { useCallback, useEffect, useState } from "react"

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
}

type HistoryHandle = {
    refresh: () => void,
}

const HistoryComponent: React.ForwardRefRenderFunction<HistoryHandle, HistoryProps> = (
    { type,  onDeleteEvent },
    forwardedRef,
    ) => {

    React.useImperativeHandle(forwardedRef, () => ({
        refresh() {
            refreshData();
        }
    }))

    const [items, setItems] = useState<
    InternalWorkEventSimplified[] |  UnavailabilityEventSimplified[]
    >([]);

    const findInternalWorks = useCallback(() => {
        if (type === Event.InternalWork) {
            axios
              .get<InternalWorkEventDTO[]>("/api/internalWork", {})
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
    }, [type]);

    const findUnavailabilities = useCallback(() => {
        if (type === Event.Unavailability)
          axios
            .get<UnavailabilityEventDTO[]>("/api/unavailability", {})
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
                  )
            }
            );
      }, [type]);

    const refreshData = useCallback(() => {
        if (type === Event.InternalWork) {
            findInternalWorks();
        } else if (type === Event.Unavailability) {
            findUnavailabilities();
        }
    }, [findInternalWorks, findUnavailabilities, type]);
      
    useEffect(refreshData, [refreshData]);

    const deleteEvent = (eventId : string) => {
        let url = "";
        if (type === Event.InternalWork) {
            url = "/api/internalWork";
        } else if (type === Event.Unavailability) {
            url = "/api/unavailability"
        }

        axios
        .delete(url, {
            params: {
                id: eventId,
            }
        })
        .then((res) => {
            if(res.status === 200) {
                onDeleteEvent();
            }
        })
    }

    return(
        <HistorySC>
            <div className="title">Historique</div>
            {type === Event.InternalWork && (items as InternalWorkEventSimplified[]).map(({ id, date, duration }, i) => {
            const dateObject = new Date(date.year, date.month, date.date);
            return (
                <MiniEvent
                key={i}
                title={`${dateObject.getDate()} ${dateObject.toLocaleString(
                    "default",
                    { month: "long" }
                  )} ${dateObject.getFullYear()}`}
                description={""}
                infoLeft={`${duration}h`}
                onDelete={() => deleteEvent(id)}
                />
            )
            })}
                
            {type === Event.Unavailability && (items as UnavailabilityEventSimplified[]).map(({ id, startDate, endDate }, i) => {
            const leftTime = dayjs(startDate).format("HH:mm");
            const rightTime = dayjs(endDate).format("HH:mm");
            return (
                <MiniEvent
                key={i}
                color="red"
                title={`${startDate.getDate()} ${startDate.toLocaleString(
                    "default",
                    { month: "long" }
                  )} ${startDate.getFullYear()}`}
                description={""}
                infoLeft={[leftTime, rightTime]}
                onDelete={() => deleteEvent(id)} 
                />
            )
            })}
        </HistorySC>
    );
};

export const History = React.forwardRef(HistoryComponent);