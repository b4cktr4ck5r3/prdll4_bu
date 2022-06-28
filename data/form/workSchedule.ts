import { BasicFormProps } from "@components/molecules";
import dayjs from "dayjs";

const defaultInitialValues = {
  name: "",
  startDate: dayjs().toDate(),
  endDate: dayjs().toDate(),
};

export type WorkScheduleFormType = typeof defaultInitialValues;

export const workScheduleInputs = (
  initialValues?: Partial<WorkScheduleFormType>,
  onChange?: BasicFormProps<WorkScheduleFormType>["onChange"]
): BasicFormProps<WorkScheduleFormType> => ({
  initialValues: { ...defaultInitialValues, ...initialValues },
  labels: {
    name: "Nom du planning",
    startDate: "Date de début",
    endDate: "Date de fin",
  },
  typeInputs: {
    name: { type: "TEXT" },
    startDate: { type: "DATE" },
    endDate: { type: "DATE" },
  },
  onChange,
});
