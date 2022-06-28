import { BasicFormProps } from "@components/molecules";
import dayjs from "dayjs";

const defaultInitialValues = {
  name: "",
  date: dayjs().toDate(),
  time: [dayjs().toDate(), dayjs().toDate()],
  users: [],
};

export type WorkScheduleTaskFormType = typeof defaultInitialValues;

export const workScheduleTaskInputs = (
  initialValues?: Partial<WorkScheduleTaskFormType>,
  onChange?: BasicFormProps<WorkScheduleTaskFormType>["onChange"]
): BasicFormProps<WorkScheduleTaskFormType> => ({
  validationRules: {
    name: (value) => value.length > 0,
    users: (values) => values.length > 0,
    date: (value) => value instanceof Date,
    time: (values) => values.every((value) => value instanceof Date),
  },
  initialValues: { ...defaultInitialValues, ...initialValues },
  labels: {
    name: "Nom de la séance",
    date: "Date de la séance",
    time: "Horaire de la séance",
    users: "Tuteur(s)",
  },
  typeInputs: {
    name: { type: "AUTOCOMPLETE", limit: 8 },
    date: { type: "DATE" },
    time: { type: "TIMERANGE" },
    users: { type: "MULTISELECT" },
  },
  onChange,
});
