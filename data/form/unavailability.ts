import { BasicFormProps } from "@components/molecules";

const defaultInitialValues = {
  date: new Date(),
  time: [new Date(), new Date()],
};

export type UnavailabilityFormType = typeof defaultInitialValues;

export const unavailabilityInputs = (
  initialValues?: Partial<UnavailabilityFormType>,
  onChange?: BasicFormProps<UnavailabilityFormType>["onChange"]
): BasicFormProps<UnavailabilityFormType> => ({
  validationRules: {
    date: (value: Date) => {
      const today = new Date();
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
    date: { type: "DATE", minDate: new Date() },
    time: { type: "TIMERANGE" },
  },
  onChange,
});
