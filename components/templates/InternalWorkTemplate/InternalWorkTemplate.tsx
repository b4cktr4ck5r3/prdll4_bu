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
  const ref = React.useRef<HistoryHandle>(null);

  const onSubmit = () => {
    if (ref.current)
      ref.current.refresh();
  }

  return (
    <PlanningContext.Provider
      value={{ refresh, synchronizedDate, setRefresh, setSynchronizedDate }}
    >
      <DefaultLayout>
        <InternalWorkTemplateSC>
          <SimplePlanning type={Event.InternalWork} />
          <InternalWorkForm onSubmit={onSubmit}/>
          <History ref={ref} type={Event.InternalWork} />
        </InternalWorkTemplateSC>
      </DefaultLayout>
    </PlanningContext.Provider>
  );
};
