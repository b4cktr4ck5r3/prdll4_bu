import { BasicFormProps } from "@components/molecules";
import dayjs from "dayjs";

const defaultInitialValues = {
  date: dayjs().toDate(),
  time: [dayjs().toDate(), dayjs().toDate()],
};

export type UnavailabilityFormType = typeof defaultInitialValues;

export const unavailabilityInputs = (
  initialValues?: Partial<UnavailabilityFormType>,
  onChange?: BasicFormProps<UnavailabilityFormType>["onChange"]
): BasicFormProps<UnavailabilityFormType> => ({
  validationRules: {
    date: (value: Date) => {
      const today = dayjs().toDate();
      return (
        value.getTime() > today.getTime() ||
        (value.getFullYear() === today.getFullYear() &&
          value.getMonth() === today.getMonth() &&
          value.getDate() === today.getDate())
      );
    },
  },
  initialValues: { ...defaultInitialValues, ...initialValues },
  labels: {
    date: "Date de l'indisponibilité",
    time: "Horaire de l'indisponibilité",
  },
  typeInputs: {
    date: { type: "DATE", minDate: dayjs().toDate() },
    time: { type: "TIMERANGE" },
  },
  onChange,
});
