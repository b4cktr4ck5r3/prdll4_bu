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
        <UnavailabilityTemplateSC>
          <SimplePlanning type={Event.Unavailability} />
          <UnavailabilityForm onSubmit={onSubmit} />
          <History ref={ref} type={Event.Unavailability} />
        </UnavailabilityTemplateSC>
      </DefaultLayout>
    </PlanningContext.Provider>
  );
};
