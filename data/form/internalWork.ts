import { BasicFormProps } from "@components/molecules";
import dayjs from "dayjs";

const defaultInitialValues = {
  date: dayjs().toDate(),
  duration: dayjs(dayjs().toDate()).hour(0).minute(0).toDate(),
  description: "",
};

export type InternalWorkFormType = typeof defaultInitialValues;

export const internalWorkInputs = (
  initialValues?: Partial<InternalWorkFormType>,
  onChange?: BasicFormProps<InternalWorkFormType>["onChange"]
): BasicFormProps<InternalWorkFormType> => ({
  validationRules: {
    date: (value: Date) => {
      const today = dayjs().toDate();
      return (
        value.getTime() < today.getTime() ||
        (value.getFullYear() === today.getFullYear() &&
          value.getMonth() === today.getMonth() &&
          value.getDate() === today.getDate())
      );
    },
    duration: (value: Date) => {
      if (!value) return false;
      const date = dayjs(value);
      return date.hour() > 0 || date.minute() > 0;
    },
  },
  initialValues: { ...defaultInitialValues, ...initialValues },
  labels: {
    date: "Date de travail interne",
    duration: "Durée (en heures et minutes)",
    description: "Description",
  },
  typeInputs: {
    date: { type: "DATE", maxDate: dayjs().toDate() },
    duration: { type: "TIME" },
    description: { type: "TEXTAREA" },
  },
  onChange,
});
