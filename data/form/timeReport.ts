import { BasicFormProps } from "@components/molecules";
import dayjs from "dayjs";

const defaultInitialValues = {
  startDate: dayjs().toDate(),
  endDate: dayjs().toDate(),
};

export type TimeReportFormType = typeof defaultInitialValues;

export const timeReportInputs = (
  initialValues?: Partial<TimeReportFormType>,
  onChange?: BasicFormProps<TimeReportFormType>["onChange"]
): BasicFormProps<TimeReportFormType> => ({
  initialValues: { ...defaultInitialValues, ...initialValues },
  labels: {
    startDate: "Date de début",
    endDate: "Date de fin",
  },
  typeInputs: {
    startDate: { type: "DATE" },
    endDate: { type: "DATE" },
  },
  onChange,
});
