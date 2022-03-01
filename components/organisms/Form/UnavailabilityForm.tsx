import { MisuseOutline32, Save20 } from "@carbon/icons-react";
import { BasicForm } from "@components/molecules";
import { FormList } from "@components/molecules/FormList";
import {
  UnavailabilityFormType,
  unavailabilityInputs,
} from "@data/form/unavailability";
import { PlanningContext } from "@lib/contexts";
import { useListState, useLocalStorageValue } from "@mantine/hooks";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useNotifications } from "@mantine/notifications";
import { Event, UnavailabilityItemForm } from "@utils/calendar";
import { BooleanString, Preferences } from "@utils/user";
import axios from "axios";
import dayjs from "dayjs";
import { FC, useCallback, useContext, useEffect, useRef } from "react";

type UnavailabilityFormProps = {
  onSubmit: () => void;
};

export const UnavailabilityForm: FC<UnavailabilityFormProps> = ({
  onSubmit,
}) => {
  const { setRefresh, synchronizedDate, setSynchronizedDate } =
    useContext(PlanningContext);
  const [syncCalendarForm] = useLocalStorageValue<BooleanString>({
    key: Preferences.SyncCalendarForm,
    defaultValue: "false",
  });
  const [unavailabilities, unavailabilitiesHandlers] =
    useListState<UnavailabilityItemForm>([]);

  const formNewDate = useRef<UseForm<UnavailabilityFormType>>();

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

  useEffect(() => {
    if (
      formNewDate.current &&
      syncCalendarForm === "true" &&
      synchronizedDate &&
      synchronizedDate.getTime() !== formNewDate.current.values.date.getTime()
    )
      formNewDate.current.setFieldValue("date", new Date(synchronizedDate));
  }, [syncCalendarForm, synchronizedDate]);

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
      onSubmitItem={(event) =>
        formNewDate.current?.onSubmit(
          ({ date, time: [startDate, endDate] }) => {
            const start = dayjs(date)
              .second(0)
              .minute(startDate.getMinutes())
              .hour(startDate.getHours());

            const end = dayjs(date)
              .second(0)
              .minute(endDate.getMinutes())
              .hour(endDate.getHours());

            unavailabilitiesHandlers.append({
              startDate: start.toDate(),
              endDate: end.toDate(),
            });
          }
        )(event)
      }
    >
      <BasicForm
        {...unavailabilityInputs(
          {},
          {
            date: setSynchronizedDate,
          }
        )}
        setForm={(form: UseForm<UnavailabilityFormType>) =>
          (formNewDate.current = form)
        }
      />
    </FormList>
  );
};
