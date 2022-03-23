import { Pen32, TrashCan32 } from "@carbon/icons-react";
import { DefaultLayout } from "@components/layouts";
import {
  History,
  InternalWorkForm,
  ManageInternalWorkModal,
  SimplePlanning,
} from "@components/organisms";
import useAccountInfo from "@hooks/useAccountInfo";
import useInternalWorks from "@hooks/useInternalWorks";
import { PlanningContext } from "@lib/contexts";
import { Button } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { styled } from "@stitches";
import { Event } from "@utils/calendar";
import React, { FC, useCallback, useEffect, useState } from "react";

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
  const { isAdmin } = useAccountInfo();
  const [openedModalIW, setOpenedModalIW] = useState(true);
  const { internalWorks: internalWorksNotValidated, mutate } = useInternalWorks(
    {
      validated: false,
    }
  );
  const [synchronizedDate, setSynchronizedDate] = useState(new Date());
  const [refresh, setRefresh] = useState(false);

  type HistoryHandle = React.ElementRef<typeof History>;
  const historyRef = React.useRef<HistoryHandle>(null);

  type SimplePlanningHandle = React.ElementRef<typeof SimplePlanning>;
  const simplePlanningRef = React.useRef<SimplePlanningHandle>(null);

  const refreshComponents = useCallback(() => {
    if (historyRef.current) historyRef.current.refresh();
    if (simplePlanningRef.current) simplePlanningRef.current.refresh();
    mutate();
  }, [mutate]);

  const notifications = useNotifications();

  const onDeleteEvent = useCallback(() => {
    refreshComponents();

    notifications.showNotification({
      color: "dark",
      title: `Un élément a été supprimé`,
      message: "Suppression d'un élément",
      icon: <TrashCan32 />,
      autoClose: 4000,
    });
  }, [notifications, refreshComponents]);

  const onEditEvent = useCallback(() => {
    refreshComponents();

    notifications.showNotification({
      color: "dark",
      title: `Un élément a été modifié`,
      message: "Modification d'un élément",
      icon: <Pen32 />,
      autoClose: 4000,
    });
  }, [notifications, refreshComponents]);

  useEffect(() => {
    if (internalWorksNotValidated.length === 0) setOpenedModalIW(false);
  }, [internalWorksNotValidated.length]);

  return (
    <PlanningContext.Provider
      value={{ refresh, synchronizedDate, setRefresh, setSynchronizedDate }}
    >
      <DefaultLayout>
        <InternalWorkTemplateSC>
          {isAdmin && (
            <InternalWorkToValidateSC>
              <Button
                disabled={internalWorksNotValidated.length === 0}
                color="orange"
                size="sm"
                onClick={() => setOpenedModalIW(true)}
              >
                {internalWorksNotValidated.length} travaux internes à valider
              </Button>
            </InternalWorkToValidateSC>
          )}
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
      </DefaultLayout>
      <ManageInternalWorkModal
        listInternalWorks={internalWorksNotValidated}
        opened={openedModalIW}
        onClose={() => setOpenedModalIW(false)}
        title={"Travaux internes non validés"}
        onChange={refreshComponents}
      />
    </PlanningContext.Provider>
  );
};
