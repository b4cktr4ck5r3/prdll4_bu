import { BasicFormProps } from "@components/molecules";

const defaultInitialValues = {
  date: new Date(),
  duration: 0,
  description: "",
};

export type InternalWorkFormType = typeof defaultInitialValues;

export const internalWorkInputs = (
  initialValues?: Partial<InternalWorkFormType>,
  onChange?: BasicFormProps<InternalWorkFormType>["onChange"]
): BasicFormProps<InternalWorkFormType> => ({
  validationRules: {
    date: (value: Date) => {
      const today = new Date();
      return (
        value.getTime() < today.getTime() ||
        (value.getFullYear() === today.getFullYear() &&
          value.getMonth() === today.getMonth() &&
          value.getDate() === today.getDate())
      );
    },
    duration: (value: number) => value > 0,
  },
  initialValues: { ...defaultInitialValues, ...initialValues },
  labels: {
    date: "Date de travail interne",
    duration: "Durée (en heure)",
    description: "Description",
  },
  typeInputs: {
    date: { type: "DATE", maxDate: new Date() },
    duration: { type: "NUMBER", step: 0.5, precision: 1, min: 0, max: 24 },
    description: { type: "TEXTAREA" },
  },
  onChange,
});
