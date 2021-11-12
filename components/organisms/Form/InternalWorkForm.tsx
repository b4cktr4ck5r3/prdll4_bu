import { Checkmark16 } from "@carbon/icons-react";
import { BoxSC } from "@components/atoms";
import { PlanningContext } from "@lib/contexts";
import { Button, Group, NumberInput, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/hooks";
import { styled } from "@stitches";
import axios from "axios";
import dayjs from "dayjs";
import { FC, useContext } from "react";

export const InternalWorkFormSC = styled("form", BoxSC, {
  width: "100%",
  maxWidth: "$384",
});

export const InternalWorkForm: FC = () => {
  const { setRefresh } = useContext(PlanningContext);
  const form = useForm({
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

  return (
    <InternalWorkFormSC
      onSubmit={form.onSubmit((values) => {
        const date = dayjs(values.date);
        axios
          .post("/api/internalWork", {
            ...values,
            date: date.add(date.utcOffset(), "m").toJSON(),
          })
          .then(() => {
            setRefresh(true);
            form.reset();
          })
          .catch(() => alert("Erreur"));
      })}
    >
      <Group direction="column" align="stretch">
        <DatePicker
          clearable={false}
          label="Date de travail interne"
          error={form.errors.date}
          value={form.values.date}
          maxDate={new Date()}
          onChange={(date) => date && form.setFieldValue("date", date)}
        />
        <NumberInput
          label="Durée (en heure)"
          step={0.5}
          precision={1}
          min={0}
          max={24}
          error={form.errors.duration}
          value={form.values.duration}
          onChange={(value) => form.setFieldValue("duration", value)}
        />
        <Textarea
          label="Description"
          error={form.errors.description}
          value={form.values.description}
          onChange={(event) =>
            form.setFieldValue("description", event.currentTarget.value)
          }
        />
        <Button type="submit" color="green" leftIcon={<Checkmark16 />}>
          Valider
        </Button>
      </Group>
    </InternalWorkFormSC>
  );
};
