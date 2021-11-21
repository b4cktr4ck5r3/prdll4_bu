import { Add16, Checkmark16 } from "@carbon/icons-react";
import { BoxSC } from "@components/atoms";
import { MiniEvent } from "@components/molecules";
import { PlanningContext } from "@lib/contexts";
import { Button } from "@mantine/core";
import { DatePicker, TimeRangeInput } from "@mantine/dates";
import { useForm, useListState, useLocalStorageValue } from "@mantine/hooks";
import { styled } from "@stitches";
import { UnavailabilityItemForm } from "@utils/calendar";
import { BooleanString, Preferences } from "@utils/user";
import axios from "axios";
import dayjs from "dayjs";
import { FC, useCallback, useContext, useEffect, useMemo } from "react";

export const UnavailabilityFormSC = styled("div", BoxSC, {
  marginBottom: "$128",
  width: "100%",
  maxWidth: "$384",
  minWidth: "$256",
  "& > * + *": {
    marginTop: "$16",
  },
});

export const UnavailabilityFormDateSC = styled("form", {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "$16",
});

export const UnavailabilityFormListSC = styled("form", {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "$16",
});

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
    <UnavailabilityFormSC>
      <UnavailabilityFormDateSC
        onSubmit={formNewDate.onSubmit((dates) => {
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
          onChange={([startDate, endDate]) =>
            formNewDate.setValues({ startDate, endDate })
          }
          error={formNewDate.errors.startDate}
        />
        <Button color="blue" type="submit" leftIcon={<Add16 />}>
          Ajouter
        </Button>
      </UnavailabilityFormDateSC>
      <UnavailabilityFormListSC>
        {unavailabilities.map(({ startDate, endDate }, i) => {
          const leftTime = dayjs(startDate).format("HH:mm");
          const rightTime = dayjs(endDate).format("HH:mm");
          return (
            <MiniEvent
              key={i}
              color="red"
              title={"Indisponibilité"}
              description={`${startDate.getDate()} ${startDate.toLocaleString(
                "default",
                { month: "long" }
              )} ${startDate.getFullYear()}`}
              infoLeft={[leftTime, rightTime]}
            />
          );
        })}
        <Button
          color="green"
          disabled={unavailabilities.length === 0}
          leftIcon={<Checkmark16 />}
          onClick={sendUnavailabilities}
        >
          Valider
        </Button>
      </UnavailabilityFormListSC>
    </UnavailabilityFormSC>
  );
};

export const UnavailabilitySC = styled("div", {
  position: "relative",
  marginTop: "$8",
  marginBottom: "$0",
  padding: "$4 $16",
  display: "flex",
  flexDirection: "column",
  "& .detail-row": {
    display: "flex",
    alignItems: "center",
  },
  "&::before": {
    content: "''",
    position: "absolute",
    borderRadius: "$full",
    top: "$4",
    left: "$4",
    bottom: "$4",
    width: "4px",
    background: "#f03e3e",
  },
});
