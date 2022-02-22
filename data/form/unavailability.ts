import { BasicFormProps } from "@components/molecules";

const defaultInitialValues = {
  date: new Date(),
  time: [new Date(), new Date()],
};

export type UnavailabilityFormType = typeof defaultInitialValues;

export const unavailabilityInputs = (
  initialValues = defaultInitialValues
): BasicFormProps<UnavailabilityFormType> => ({
  initialValues: initialValues,
  labels: {
    date: "Date de l'indisponibilité",
    time: "Horaire de l'indisponibilité",
  },
  typeInputs: {
    date: { type: "DATE", minDate: new Date() },
    time: { type: "TIMERANGE" },
  },
});
