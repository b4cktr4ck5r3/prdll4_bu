import { Pen32, TrashCan32 } from "@carbon/icons-react";
import { DefaultLayout } from "@components/layouts";
import {
  History,
  SimplePlanning,
  UnavailabilityForm,
} from "@components/organisms";
import { PlanningContext } from "@lib/contexts";
import { useNotifications } from "@mantine/notifications";
import { styled } from "@stitches";
import { Event } from "@utils/calendar";
import React, { FC, useCallback, useState } from "react";

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

  const refreshComponents = useCallback(() => {
    if (historyRef.current) historyRef.current.refresh();

    if (simplePlanningRef.current) simplePlanningRef.current.refresh();
  }, []);

  const notifications = useNotifications();

  const onDeleteEvent = useCallback(() => {
    refreshComponents();

    notifications.showNotification({
      color: "blue",
      title: `Un élément a été supprimé`,
      message: "Suppression d'un élément",
      icon: <TrashCan32 />,
      autoClose: 4000,
    });
  }, [notifications, refreshComponents]);

  const onEditEvent = useCallback(() => {
    refreshComponents();

    notifications.showNotification({
      color: "blue",
      title: `Un élément a été modifié`,
      message: "Modification d'un élément",
      icon: <Pen32 />,
      autoClose: 4000,
    });
  }, [notifications, refreshComponents]);

  return (
    <PlanningContext.Provider
      value={{ refresh, synchronizedDate, setRefresh, setSynchronizedDate }}
    >
      <DefaultLayout>
        <UnavailabilityTemplateSC>
          <SimplePlanning
            ref={simplePlanningRef}
            type={Event.Unavailability}
            onDeleteEvent={onDeleteEvent}
            onEditEvent={onEditEvent}
          />
          <UnavailabilityForm onSubmit={refreshComponents} />
          <History
            ref={historyRef}
            type={Event.Unavailability}
            onDeleteEvent={onDeleteEvent}
            onEditEvent={onEditEvent}
          />
        </UnavailabilityTemplateSC>
      </DefaultLayout>
    </PlanningContext.Provider>
  );
};
