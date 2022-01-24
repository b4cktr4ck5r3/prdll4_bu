import { FormList } from "@components/molecules/FormList";
import { PlanningContext } from "@lib/contexts";
import { DatePicker, TimeRangeInput } from "@mantine/dates";
import { useForm, useListState, useLocalStorageValue } from "@mantine/hooks";
import { Event, UnavailabilityItemForm } from "@utils/calendar";
import { BooleanString, Preferences } from "@utils/user";
import axios from "axios";
import { FC, useCallback, useContext, useEffect, useMemo } from "react";

export const UnavailabilityForm: FC = () => {
  const { setRefresh, synchronizedDate, setSynchronizedDate } =
    useContext(PlanningContext);
  const [syncCalendarForm] = useLocalStorageValue<BooleanString>({
    key: Preferences.SyncCalendarForm,
    defaultValue: "false",
  });
  const [unavailabilities, unavailabilitiesHandlers] =
    useListState<UnavailabilityItemForm>([]);

  const formNewDate = useForm<UnavailabilityItemForm>({
    initialValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
    validationRules: {
      startDate: (startDate, values) => {
        const endDate = values?.endDate || new Date(0);
        return startDate.getTime() <= (endDate.getTime() || 0);
      },
    },
  });

  const { startDate, endDate } = useMemo(
    () => formNewDate.values,
    [formNewDate]
  );

  const changeDate = useCallback((prevDate: Date, nextDate: Date) => {
    const newDate = new Date(prevDate);
    newDate.setDate(nextDate.getDate());
    newDate.setMonth(nextDate.getMonth());
    newDate.setFullYear(nextDate.getFullYear());
    return newDate;
  }, []);

  const sendUnavailabilities = useCallback(() => {
    axios
      .post("/api/unavailability", unavailabilities)
      .then(() => {
        setRefresh(true);
        unavailabilitiesHandlers.setState([]);
      })
      .catch(() => alert("Erreur"));
  }, [unavailabilities, unavailabilitiesHandlers, setRefresh]);

  useEffect(() => {
    const { startDate, endDate } = formNewDate.values;
    if (
      syncCalendarForm === "true" &&
      synchronizedDate &&
      (synchronizedDate.getFullYear() !== startDate.getFullYear() ||
        synchronizedDate.getMonth() !== startDate.getMonth() ||
        synchronizedDate.getDate() !== startDate.getDate())
    )
      formNewDate.setValues({
        startDate: changeDate(startDate, synchronizedDate),
        endDate: changeDate(endDate, synchronizedDate),
      });
  }, [changeDate, formNewDate, syncCalendarForm, synchronizedDate]);

  return (
    <FormList
      data={unavailabilities}
      type={Event.Unavailability}
      disabled={unavailabilities.length === 0}
      onSubmitAll={sendUnavailabilities}
      onSubmitItem={formNewDate.onSubmit((dates) => {
        unavailabilitiesHandlers.append({
          startDate: new Date(dates.startDate),
          endDate: new Date(dates.endDate),
        });
      })}
    >
      <DatePicker
        clearable={false}
        label="Date de l'indisponibilité"
        minDate={new Date()}
        value={startDate}
        onChange={(newDate: Date) => {
          formNewDate.setValues({
            startDate: changeDate(startDate, newDate),
            endDate: changeDate(endDate, newDate),
          });
          setSynchronizedDate(newDate);
        }}
      />
      <TimeRangeInput
        label="Horaire de l'indisponibilité"
        value={[startDate, endDate]}
        onChange={([startDate, endDate]) => {
          return formNewDate.setValues({ startDate, endDate });
        }}
        error={formNewDate.errors.startDate}
      />
    </FormList>
  );
};
