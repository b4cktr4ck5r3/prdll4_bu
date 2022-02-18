import { MisuseOutline32, Save20 } from "@carbon/icons-react";
import { BoxSC } from "@components/atoms";
import { FormList } from "@components/molecules/FormList";
import { InternalWorkTemplateSC } from "@components/templates";
import { PlanningContext } from "@lib/contexts";
import { NumberInput, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, useListState, useLocalStorageValue } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import { styled } from "@stitches";
import { Event, InternalWorkItemForm } from "@utils/calendar";
import { BooleanString, Preferences } from "@utils/user";
import axios from "axios";
import dayjs from "dayjs";
import { FC, useCallback, useContext, useEffect } from "react";

export const InternalWorkFormSC = styled("form", BoxSC, {
  width: "100%",
  maxWidth: "$384",
  minWidth: "$256",
});

export const InternalWorkForm: FC = () => {
  const { setRefresh, synchronizedDate, setSynchronizedDate } =
    useContext(PlanningContext);
  const [syncCalendarForm] = useLocalStorageValue<BooleanString>({
    key: Preferences.SyncCalendarForm,
    defaultValue: "false",
  });
  const [internalWorks, internalWorksHandlers] =
    useListState<InternalWorkItemForm>([]);

  const formNewIW = useForm({
    initialValues: {
      date: new Date(),
      duration: 0,
      description: "",
    },
    validationRules: {
      date: (value) => {
        const today = new Date();
        return (
          value.getTime() < today.getTime() ||
          (value.getFullYear() === today.getFullYear() &&
            value.getMonth() === today.getMonth() &&
            value.getDate() === today.getDate())
        );
      },
      duration: (value) => value > 0,
    },
  });

  const changeDate = useCallback(
    (date: Date) => {
      formNewIW.setFieldValue("date", date);
      setSynchronizedDate(date);
    },
    [formNewIW, setSynchronizedDate]
  );

  const notifications = useNotifications();

  const sendInternalWorks = useCallback(() => {
    axios
      .post("/api/internalWork",
      internalWorks.map((iw) => {
        const date = dayjs(iw.date);
        return {
          ...iw,
          date: date.add(date.utcOffset(), "m").toJSON(),
        };
      }))
      .then(() => {
        setRefresh(true);
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
  }, [internalWorks, setRefresh, internalWorksHandlers, notifications]);

  useEffect(() => {
    if (
      syncCalendarForm === "true" &&
      synchronizedDate &&
      synchronizedDate.getTime() !== formNewIW.values.date.getTime()
    )
      formNewIW.setFieldValue("date", synchronizedDate);
  }, [formNewIW, syncCalendarForm, synchronizedDate]);

  return (
    <FormList
      data={internalWorks}
      type={Event.InternalWork}
      disabled={internalWorks.length === 0}
      onSubmitAll={sendInternalWorks}
      onSubmitItem={formNewIW.onSubmit((newInternalWork) => {
        internalWorksHandlers.append({
          date: new Date(newInternalWork.date),
          description: newInternalWork.description,
          duration: newInternalWork.duration,
        });
      })}
    >
      <DatePicker
        clearable={false}
        label="Date de travail interne"
        error={formNewIW.errors.date}
        value={formNewIW.values.date}
        maxDate={new Date()}
        onChange={(date) => date && changeDate(date)}
      />
      <NumberInput
        label="Durée (en heure)"
        step={0.5}
        precision={1}
        min={0}
        max={24}
        error={formNewIW.errors.duration}
        value={formNewIW.values.duration}
        onChange={(value) => formNewIW.setFieldValue("duration", value || 0)}
      />
      <Textarea
        label="Description"
        error={formNewIW.errors.description}
        value={formNewIW.values.description}
        onChange={(event) =>
          formNewIW.setFieldValue("description", event.currentTarget.value)
        }
      />
    </FormList>
  );
};
