import { TrashCan32 } from "@carbon/icons-react";
import { DefaultLayout } from "@components/layouts";
import { History, InternalWorkForm, SimplePlanning } from "@components/organisms";
import { PlanningContext } from "@lib/contexts";
import { useNotifications } from "@mantine/notifications";
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
  
  const notifications = useNotifications();

  const onDeleteEvent = () => {
    if (historyRef.current)
    historyRef.current.refresh();

    if (simplePlanningRef.current)
    simplePlanningRef.current.refresh();

    notifications.showNotification({
      color: "dark",
      title: `Un élément a été supprimé`,
      message: "Suppression d'un élément",
      icon: <TrashCan32 />,
      autoClose: 4000,
    });
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
