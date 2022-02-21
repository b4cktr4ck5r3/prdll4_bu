import { DefaultLayout } from "@components/layouts";
import { SimplePlanning, UnavailabilityForm, History } from "@components/organisms";
import { PlanningContext } from "@lib/contexts";
import { styled } from "@stitches";
import { Event } from "@utils/calendar";
import React from "react";
import { FC, useState } from "react";

export const UnavailabilityTemplateSC = styled("div", {
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "$24",
  "@tablet": {
    alignItems: "flex-start",
    flexDirection: "row",
  },
});

export const UnavailabilityTemplate: FC = () => {
  const [synchronizedDate, setSynchronizedDate] = useState(new Date());
  const [refresh, setRefresh] = useState(false);

  type HistoryHandle = React.ElementRef<typeof History>;
  const historyRef = React.useRef<HistoryHandle>(null);

  type SimplePlanningHandle = React.ElementRef<typeof SimplePlanning>;
  const simplePlanningRef = React.useRef<SimplePlanningHandle>(null);

  const onSubmit = () => {
    if (historyRef.current)
    historyRef.current.refresh();
  }

  const onDeleteEvent = () => {
    if (historyRef.current)
    historyRef.current.refresh();

    if (simplePlanningRef.current)
    simplePlanningRef.current.refresh();
  }


  return (
    <PlanningContext.Provider
      value={{ refresh, synchronizedDate, setRefresh, setSynchronizedDate }}
    >
      <DefaultLayout>
        <UnavailabilityTemplateSC>
          <SimplePlanning ref={simplePlanningRef} type={Event.Unavailability} onDeleteEvent={onDeleteEvent}/>
          <UnavailabilityForm onSubmit={onSubmit} />
          <History ref={historyRef} type={Event.Unavailability} onDeleteEvent={onDeleteEvent}/>
        </UnavailabilityTemplateSC>
      </DefaultLayout>
    </PlanningContext.Provider>
  );
};
