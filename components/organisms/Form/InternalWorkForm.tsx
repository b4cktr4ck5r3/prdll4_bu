import { MisuseOutline32, Save20 } from "@carbon/icons-react";
import { BasicForm } from "@components/molecules";
import { FormList } from "@components/molecules/FormList";
import { InternalWorkFormType, internalWorkInputs } from "@data/form";
import { useSyncCalendarForm } from "@hooks";
import { PlanningContext } from "@lib/contexts";
import { useListState } from "@mantine/hooks";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useNotifications } from "@mantine/notifications";
import { Event, InternalWorkItemForm } from "@utils/calendar";
import axios from "axios";
import dayjs from "dayjs";
import { FC, useCallback, useContext, useEffect, useRef } from "react";

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
          color: "blue",
          title: `Ajout de ${internalWorks.length} travaux interne`,
          message: `${internalWorks.length} travaux interne ajouté(s)`,
          icon: <Save20 />,
          autoClose: 4000,
        });
      })
      .catch(() => {
        notifications.showNotification({
          color: "red",
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
      disabledAll={internalWorks.length === 0}
      onSubmitAll={sendInternalWorks}
      onDeleteItem={deleteItem}
      onSubmitItem={(event) => {
        formNewIW.current?.onSubmit((newInternalWork) => {
          const time = dayjs(newInternalWork.duration);
          internalWorksHandlers.append({
            date: dayjs(newInternalWork.date).toDate(),
            description: newInternalWork.description,
            duration: time.hour() + time.minute() / 60,
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
