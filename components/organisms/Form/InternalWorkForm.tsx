import { MisuseOutline32, Save20 } from "@carbon/icons-react";
import { BoxSC } from "@components/atoms";
import { BasicForm } from "@components/molecules";
import { FormList } from "@components/molecules/FormList";
import { InternalWorkFormType, internalWorkInputs } from "@data/form";
import { PlanningContext } from "@lib/contexts";
import { useListState } from "@mantine/hooks";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useNotifications } from "@mantine/notifications";
import { styled } from "@stitches";
import { Event, InternalWorkItemForm } from "@utils/calendar";
import axios from "axios";
import { FC, useCallback, useContext, useMemo, useState } from "react";

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
  const [formNewIW, setFormNewIW] = useState<UseForm<InternalWorkFormType>>();
  // const [syncCalendarForm] = useLocalStorageValue<BooleanString>({
  //   key: Preferences.SyncCalendarForm,
  //   defaultValue: "false",
  // });
  const [internalWorks, internalWorksHandlers] =
    useListState<InternalWorkItemForm>([]);

  // const changeDate = useCallback(
  //   (date: Date) => {
  //     formNewIW.setFieldValue("date", new Date(date.setUTCHours(0, 0, 0, 0)));
  //     setSynchronizedDate(date);
  //   },
  //   [formNewIW, setSynchronizedDate]
  // );

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

  // useEffect(() => {
  //   if (
  //     syncCalendarForm === "true" &&
  //     synchronizedDate &&
  //     synchronizedDate.getTime() !== formNewIW.values.date.getTime()
  //   )
  //     formNewIW.setFieldValue("date", synchronizedDate);
  // }, [formNewIW, syncCalendarForm, synchronizedDate]);

  const FormElement = useMemo(
    () => (
      <BasicForm
        {...internalWorkInputs()}
        setForm={(form: UseForm<InternalWorkFormType>) => setFormNewIW(form)}
      />
    ),
    []
  );

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
      onSubmitItem={formNewIW?.onSubmit(
        (newInternalWork: InternalWorkFormType) => {
          internalWorksHandlers.append({
            date: new Date(newInternalWork.date),
            description: newInternalWork.description,
            duration: newInternalWork.duration,
          });
        }
      )}
    >
      {FormElement}
    </FormList>
  );
};
