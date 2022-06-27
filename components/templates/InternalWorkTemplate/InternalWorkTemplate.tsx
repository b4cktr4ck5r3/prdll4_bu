import { Pen32, TrashCan32 } from "@carbon/icons-react";
import { DefaultLayout } from "@components/layouts";
import {
  History,
  InternalWorkForm,
  ManageInternalWork,
  SimplePlanning,
} from "@components/organisms";
import { useCurrentUser } from "@hooks";
import { PlanningContext } from "@lib/contexts";
import { useNotifications } from "@mantine/notifications";
import { styled } from "@stitches";
import { Event } from "@utils/calendar";
import React, { FC, useCallback, useState } from "react";

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

export const InternalWorkToValidateSC = styled("div", {
  width: "$full",
});

export const InternalWorkTemplate: FC = () => {
  const { isAdmin } = useCurrentUser();
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
        {!isAdmin ? (
          <InternalWorkTemplateSC>
            <SimplePlanning
              ref={simplePlanningRef}
              type={Event.InternalWork}
              onDeleteEvent={onDeleteEvent}
              onEditEvent={onEditEvent}
            />
            <InternalWorkForm onSubmit={refreshComponents} />
            <History
              ref={historyRef}
              type={Event.InternalWork}
              onDeleteEvent={onDeleteEvent}
              onEditEvent={onEditEvent}
            />
          </InternalWorkTemplateSC>
        ) : (
          <ManageInternalWork />
        )}
      </DefaultLayout>
    </PlanningContext.Provider>
  );
};
