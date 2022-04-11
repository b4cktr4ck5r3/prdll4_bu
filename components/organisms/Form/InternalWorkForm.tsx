import { MisuseOutline32, Save20 } from "@carbon/icons-react";
import { BoxSC } from "@components/atoms";
import { BasicForm } from "@components/molecules";
import { FormList } from "@components/molecules/FormList";
import { InternalWorkFormType, internalWorkInputs } from "@data/form";
import useSyncCalendarForm from "@hooks/useSyncCalendarForm";
import { PlanningContext } from "@lib/contexts";
import { useListState } from "@mantine/hooks";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useNotifications } from "@mantine/notifications";
import { styled } from "@stitches";
import { Event, InternalWorkItemForm } from "@utils/calendar";
import axios from "axios";
import { FC, useCallback, useContext, useEffect, useRef } from "react";

export const InternalWorkFormSC = styled("form", BoxSC, {
  width: "100%",
  maxWidth: "$384",
  minWidth: "$256",
});

type InternalWorkFormProps = {
  onSubmit: () => void;
};

export const InternalWorkForm: FC<InternalWorkFormProps> = ({ onSubmit }) => {
  const { setRefresh, synchronizedDate, setSynchronizedDate } =
    useContext(PlanningContext);
  const formNewIW = useRef<UseForm<InternalWorkFormType>>();
  const { syncCalendarForm } = useSyncCalendarForm();
  const [internalWorks, internalWorksHandlers] =
    useListState<InternalWorkItemForm>([]);

  const notifications = useNotifications();

  const sendInternalWorks = useCallback(() => {
    axios
      .post(
        "/api/internalWork",
        internalWorks.map((iw) => {
          return {
            ...iw,
            date: iw.date.toISOString(),
          };
        })
      )
      .then(() => {
        setRefresh(true);
        onSubmit();
        internalWorksHandlers.setState([]);
        notifications.showNotification({
          color: "dark",
          title: `Ajout de ${internalWorks.length} travaux interne`,
          message: `${internalWorks.length} travaux interne ajouté(s)`,
          icon: <Save20 />,
          autoClose: 4000,
        });
      })
      .catch(() => {
        notifications.showNotification({
          color: "dark",
          title: `Ajout de ${internalWorks.length} travaux interne`,
          message: "Erreur dans l'ajout",
          icon: <MisuseOutline32 />,
          autoClose: 4000,
        });
      });
  }, [
    internalWorks,
    setRefresh,
    onSubmit,
    internalWorksHandlers,
    notifications,
  ]);

  useEffect(() => {
    if (formNewIW.current && syncCalendarForm && synchronizedDate)
      formNewIW.current.setFieldValue("date", synchronizedDate);
  }, [syncCalendarForm, synchronizedDate]);

  const deleteItem = useCallback(
    (index: number) => {
      internalWorksHandlers.remove(index);
    },
    [internalWorksHandlers]
  );

  return (
    <FormList
      data={internalWorks}
      type={Event.InternalWork}
      disabled={internalWorks.length === 0}
      onSubmitAll={sendInternalWorks}
      onDeleteItem={deleteItem}
      onSubmitItem={(event) => {
        formNewIW.current?.onSubmit((newInternalWork) => {
          internalWorksHandlers.append({
            date: new Date(newInternalWork.date),
            description: newInternalWork.description,
            duration: newInternalWork.duration,
          });
        })(event);
      }}
    >
      <BasicForm
        {...internalWorkInputs(
          {},
          {
            date: setSynchronizedDate,
          }
        )}
        setForm={(form: UseForm<InternalWorkFormType>) =>
          (formNewIW.current = form)
        }
      />
    </FormList>
  );
};
