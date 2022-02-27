import { MisuseOutline32, Save20 } from "@carbon/icons-react";
import { BasicForm } from "@components/molecules";
import { FormList } from "@components/molecules/FormList";
import {
  UnavailabilityFormType,
  unavailabilityInputs,
} from "@data/form/unavailability";
import { PlanningContext } from "@lib/contexts";
import { useListState } from "@mantine/hooks";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useNotifications } from "@mantine/notifications";
import { Event, UnavailabilityItemForm } from "@utils/calendar";
import axios from "axios";
import dayjs from "dayjs";
import { FC, useCallback, useContext, useMemo, useState } from "react";

type UnavailabilityFormProps = {
  onSubmit: () => void;
};

export const UnavailabilityForm: FC<UnavailabilityFormProps> = ({
  onSubmit,
}) => {
  const { setRefresh, synchronizedDate, setSynchronizedDate } =
    useContext(PlanningContext);
  // const [syncCalendarForm] = useLocalStorageValue<BooleanString>({
  //   key: Preferences.SyncCalendarForm,
  //   defaultValue: "false",
  // });
  const [unavailabilities, unavailabilitiesHandlers] =
    useListState<UnavailabilityItemForm>([]);

  const [formNewDate, setFormNewDate] =
    useState<UseForm<UnavailabilityFormType>>();

  // const changeDate = useCallback((prevDate: Date, nextDate: Date) => {
  //   const newDate = new Date(prevDate);
  //   newDate.setDate(nextDate.getDate());
  //   newDate.setMonth(nextDate.getMonth());
  //   newDate.setFullYear(nextDate.getFullYear());
  //   return newDate;
  // }, []);

  const notifications = useNotifications();

  const sendUnavailabilities = useCallback(() => {
    axios
      .post("/api/unavailability", unavailabilities)
      .then(() => {
        setRefresh(true);
        onSubmit();
        unavailabilitiesHandlers.setState([]);
        notifications.showNotification({
          color: "dark",
          title: `Ajout de ${unavailabilities.length} indisponibilité(s)`,
          message: `${unavailabilities.length} indisponibilité(s) ajoutée(s)`,
          icon: <Save20 />,
          autoClose: 4000,
        });
      })
      .catch(() => {
        notifications.showNotification({
          color: "dark",
          title: `Ajout de ${unavailabilities.length} indisponibilité(s)`,
          message: "Erreur dans l'ajout",
          icon: <MisuseOutline32 />,
          autoClose: 4000,
        });
      });
  }, [
    unavailabilities,
    setRefresh,
    onSubmit,
    unavailabilitiesHandlers,
    notifications,
  ]);

  // useEffect(() => {
  //   const { startDate, endDate } = formNewDate.values;
  //   if (
  //     syncCalendarForm === "true" &&
  //     synchronizedDate &&
  //     (synchronizedDate.getFullYear() !== startDate.getFullYear() ||
  //       synchronizedDate.getMonth() !== startDate.getMonth() ||
  //       synchronizedDate.getDate() !== startDate.getDate())
  //   )
  //     formNewDate.setValues({
  //       startDate: changeDate(startDate, synchronizedDate),
  //       endDate: changeDate(endDate, synchronizedDate),
  //     });
  // }, [changeDate, formNewDate, syncCalendarForm, synchronizedDate]);

  const FormElement = useMemo(
    () => (
      <BasicForm
        {...unavailabilityInputs()}
        setForm={(form: UseForm<UnavailabilityFormType>) =>
          setFormNewDate(form)
        }
      />
    ),
    []
  );

  const deleteItem = useCallback(
    (index: number) => {
      unavailabilitiesHandlers.remove(index);
    },
    [unavailabilitiesHandlers]
  );

  return (
    <FormList
      data={unavailabilities}
      type={Event.Unavailability}
      disabled={unavailabilities.length === 0}
      onDeleteItem={deleteItem}
      onSubmitAll={sendUnavailabilities}
      onSubmitItem={formNewDate?.onSubmit(
        ({ date, time: [startDate, endDate] }) => {
          const start = dayjs(date)
            .second(0)
            .minute(startDate.getMinutes())
            .hour(startDate.getHours());
          // const startMinute = startDate.getMinutes();

          // if (startMinute < 15) start = start.minute(0);
          // else if (startMinute < 30) start = start.minute(15);
          // else if (startMinute < 45) start = start.minute(30);
          // else start = start.minute(45);

          const end = dayjs(date)
            .second(0)
            .minute(endDate.getMinutes())
            .hour(endDate.getHours());
          // const endMinute = endDate.getMinutes();

          // if (endMinute < 15) end = end.minute(0);
          // else if (startMinute < 30) end = end.minute(30);
          // else if (startMinute < 45) end = end.minute(45);
          // else end = end.minute(15);

          unavailabilitiesHandlers.append({
            startDate: start.toDate(),
            endDate: end.toDate(),
          });
        }
      )}
    >
      {FormElement}
    </FormList>
  );
};
