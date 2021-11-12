import { Add16, Checkmark16 } from "@carbon/icons-react";
import { BoxSC } from "@components/atoms";
import { Button, Group, Text } from "@mantine/core";
import { DatePicker, TimeRangeInput } from "@mantine/dates";
import { useForm } from "@mantine/hooks";
import { styled } from "@stitches";
import { FC, useState } from "react";

export const UnavailabilityFormSC = styled("form", BoxSC, {
  marginBottom: "$128",
  minWidth: "320px",
});

export const UnavailabilityForm: FC = () => {
  const [dateInput, setDateInput] = useState<[Date, Date]>([
    new Date(),
    new Date(),
  ]);

  const form = useForm({
    initialValues: {
      unavailabilities: [] as [Date, Date][],
    },
  });

  return (
    <UnavailabilityFormSC>
      <Group direction="column" align="stretch">
        <DatePicker
          clearable={false}
          label="Date de l'indisponibilité"
          value={dateInput[0]}
          onChange={(newDate: Date) => {
            setDateInput(
              dateInput.map((date) => {
                date.setDate(newDate.getDate());
                date.setMonth(newDate.getMonth());
                date.setFullYear(newDate.getFullYear());
                return date;
              }) as [Date, Date]
            );
          }}
        />
        <TimeRangeInput
          label="Horaire de l'indisponibilité"
          value={dateInput}
          onChange={setDateInput}
        />
        <Button
          color="blue"
          leftIcon={<Add16 />}
          onClick={() => {
            form.setValues({
              unavailabilities: [...form.values.unavailabilities, dateInput],
            });
            setDateInput([new Date(), new Date()]);
          }}
        >
          Ajouter
        </Button>
      </Group>
      <Group direction="column" align="stretch">
        {form.values.unavailabilities.map((dates) => (
          <UnavailabilitySC key={dates[0].getTime()}>
            <Text component="span" className="label" weight="bold" size="md">
              {`${dates[0].getDate()} ${dates[0].toLocaleString("fr", {
                month: "long",
              })} ${dates[0].getFullYear()}`}
            </Text>
            <Text
              color="dimmed"
              className="detail-row"
              component="span"
              weight="bold"
              size="lg"
            >
              <Text component="time" dateTime="9:30">
                {`${dates[0].getHours()}h${dates[0].getMinutes()}`}
              </Text>
              <Text component="time" dateTime="11:00">
                {`${dates[1].getHours()}h${dates[1].getMinutes()}`}
              </Text>
            </Text>
          </UnavailabilitySC>
        ))}

        <Button color="green" leftIcon={<Checkmark16 />}>
          Valider
        </Button>
      </Group>
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
