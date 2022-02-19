import { BoxSC } from "@components/atoms";
import { MiniEvent } from "@components/molecules";
import { styled } from "@stitches/react";
import { InternalWorkItemForm, UnavailabilityItemForm, Event, InternalWorkEventDTO, UnavailabilityEventDTO} from "@utils/calendar"
import axios from "axios";
import { FC, useCallback, useEffect, useState } from "react"

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

export type HistoryProps = {
    type: "ALL" | Event,
    data?: (InternalWorkEventDTO | UnavailabilityEventDTO)[];
}

export const History: FC<HistoryProps> = ({
    type,
    data
}) => {
    const [internalWorks, setInternalWorks] = useState<
    InternalWorkEventDTO[]
    >([]);
    const [unavailabilities, setUnavailabilities] = useState<
    UnavailabilityEventDTO[]
    >([]);

    const findInternalWorks = useCallback(() => {
        if (type === "ALL" || type === Event.InternalWork)
          axios
            .get<InternalWorkEventDTO[]>("/api/internalWork", {})
            .then(({ data }) => {
                data.sort((a, b) => +new Date(b.date) - +new Date(a.date));
                setInternalWorks(data);
            });
      }, [type]);

    useEffect(() => {
        findInternalWorks();
      }, [findInternalWorks]);
         
    return(
        <HistorySC>
            <div className="title">Historique</div>
            {internalWorks.map(({ duration, description }, i) => (
            <MiniEvent
                key={i}
                title={"Travail Interne"}
                description={description || "Sans description"}
                infoLeft={`${duration}h`}
            />
            ))}
        </HistorySC>
    );
};