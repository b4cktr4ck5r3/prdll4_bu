import { MisuseOutline32, Save20 } from "@carbon/icons-react";
import { BasicForm } from "@components/molecules";
import { FormList } from "@components/molecules/FormList";
import {
  UnavailabilityFormType,
  unavailabilityInputs,
} from "@data/form/unavailability";
import { useCurrentUser, useSyncCalendarForm } from "@hooks";
import { PlanningContext } from "@lib/contexts";
import { useListState } from "@mantine/hooks";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useNotifications } from "@mantine/notifications";
import { Event, UnavailabilityItemForm } from "@utils/calendar";
import { WorkScheduleTaskFull } from "@utils/workScheduleTask";
import axios from "axios";
import dayjs from "dayjs";
import { FC, useCallback, useContext, useEffect, useRef } from "react";

type UnavailabilityFormProps = {
  onSubmit: () => void;
};

export const UnavailabilityForm: FC<UnavailabilityFormProps> = ({
  onSubmit,
}) => {
  const { user } = useCurrentUser();
  const { setRefresh, synchronizedDate, setSynchronizedDate } =
    useContext(PlanningContext);
  const { syncCalendarForm } = useSyncCalendarForm();
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
          color: "blue",
          title: `Ajout de ${unavailabilities.length} indisponibilité(s)`,
          message: `${unavailabilities.length} indisponibilité(s) ajoutée(s)`,
          icon: <Save20 />,
          autoClose: 4000,
        });
      })
      .catch(() => {
        notifications.showNotification({
          color: "red",
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
      syncCalendarForm &&
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

  const checkWorkScheduleTask = useCallback(
    (startDate: Date, endDate: Date) => {
      return axios
        .get<WorkScheduleTaskFull[]>("/api/workScheduleTask", {
          params: {
            userId: user?.id,
            startDate,
            endDate,
            acceptEqualDate: false,
          },
        })
        .then((res) => res.data);
    },
    [user]
  );

  return (
    <FormList
      data={unavailabilities}
      type={Event.Unavailability}
      disabledAll={unavailabilities.length === 0}
      onDeleteItem={deleteItem}
      onSubmitAll={sendUnavailabilities}
      onSubmitItem={(event) =>
        formNewDate.current?.onSubmit(
          async ({ date, time: [startDate, endDate] }) => {
            const start = dayjs(date)
              .second(0)
              .minute(startDate.getMinutes())
              .hour(startDate.getHours());
            const end = dayjs(date)
              .second(0)
              .minute(endDate.getMinutes())
              .hour(endDate.getHours());
            const tasks = await checkWorkScheduleTask(
              start.toDate(),
              end.toDate()
            );

            if (tasks.length === 0) {
              unavailabilitiesHandlers.append({
                startDate: start.toDate(),
                endDate: end.toDate(),
              });
            } else {
              alert("Une séance est prévue à cette période");
            }
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
