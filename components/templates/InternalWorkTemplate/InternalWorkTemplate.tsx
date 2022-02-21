import { DefaultLayout } from "@components/layouts";
import { History, InternalWorkForm, SimplePlanning } from "@components/organisms";
import { PlanningContext } from "@lib/contexts";
import { styled } from "@stitches";
import { Event } from "@utils/calendar";
import React from "react";
import { FC, useState } from "react";

export const InternalWorkTemplateSC = styled("div", {
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "$24",
  "@desktop": {
    alignItems: "flex-start",
    flexDirection: "row",
  },
});

export const InternalWorkTemplate: FC = () => {
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
        <InternalWorkTemplateSC>
          <SimplePlanning ref={simplePlanningRef} type={Event.InternalWork} onDeleteEvent={onDeleteEvent}/>
          <InternalWorkForm onSubmit={onSubmit}/>
          <History ref={historyRef} type={Event.InternalWork} onDeleteEvent={onDeleteEvent}/>
        </InternalWorkTemplateSC>
      </DefaultLayout>
    </PlanningContext.Provider>
  );
};
