import {
  Autocomplete,
  MultiSelect,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker, TimeInput, TimeRangeInput } from "@mantine/dates";
import { useForm } from "@mantine/hooks";
import {
  UseForm,
  UseFormErrors,
  ValidationRule,
} from "@mantine/hooks/lib/use-form/use-form";
import { FC, useEffect, useMemo } from "react";

export type BasicFormProps<T = Record<string, unknown>> = {
  setForm?: (form: UseForm<T>) => void;
  validationRules?: ValidationRule<T>;
  errorMessages?: UseFormErrors<T>;
  initialValues: T;
  labels: { readonly [P in keyof T]: string };
  typeInputs: {
    readonly [P in keyof T]:
      | { type: "TEXT"; placeholder?: string }
      | { type: "SELECT"; data: { label: string; value: string }[] }
      | { type: "TEXTAREA"; placeholder?: string }
      | { type: "DATE"; minDate?: Date; maxDate?: Date }
      | { type: "TIME" }
      | {
          type: "NUMBER";
          step?: number;
          precision?: number;
          min?: number;
          max?: number;
        }
      | { type: "TIMERANGE" }
      | { type: "MULTISELECT" }
      | { type: "AUTOCOMPLETE"; placeholder?: string; limit?: number };
  };
  onChange?: { readonly [P in keyof T]?: (value: unknown) => void };
  listData?: {
    readonly [P in keyof T]?: { label: string; value: string }[] | string[];
  };
};

export const BasicForm: FC<BasicFormProps> = ({
  setForm,
  initialValues,
  validationRules,
  labels,
  onChange = {},
  typeInputs,
  errorMessages,
  listData = {},
}) => {
  const form = useForm({ initialValues, errorMessages, validationRules });

  const inputs = useMemo(() => {
    return Object.keys(initialValues).reduce<JSX.Element[]>((inputs, key) => {
      const typeInput = typeInputs[key];
      const data = listData[key];
      const callback = onChange[key] || (() => null);
      if (typeInput?.type === "TIMERANGE")
        inputs.push(
          <TimeRangeInput
            key={key}
            label={labels[key]}
            error={form.errors[key]}
            value={form.values[key] as [Date, Date]}
            onChange={(values) => {
              form.setFieldValue(key, values);
              callback(values);
            }}
          />
        );
      else if (typeInput?.type === "DATE")
        inputs.push(
          <DatePicker
            key={key}
            locale="fr"
            label={labels[key]}
            clearable={false}
            error={form.errors[key]}
            value={form.values[key] as Date}
            minDate={typeInput.minDate}
            maxDate={typeInput.maxDate}
            onChange={(date) => {
              if (date) form.setFieldValue(key, date);
              callback(date);
            }}
          />
        );
      else if (typeInput?.type === "NUMBER")
        inputs.push(
          <NumberInput
            key={key}
            label={labels[key]}
            step={typeInput.step}
            precision={typeInput.precision}
            min={typeInput.min}
            max={typeInput.max}
            error={form.errors[key]}
            value={form.values[key] as number}
            onChange={(value) => {
              form.setFieldValue(key, value || 0);
              callback(value);
            }}
          />
        );
      else if (typeInput?.type === "SELECT")
        inputs.push(
          <Select
            key={key}
            label={labels[key]}
            data={data || []}
            error={form.errors[key]}
            value={form.values[key] as string}
            onChange={(value) => {
              form.setFieldValue(key, value);
              callback(value);
            }}
          />
        );
      else if (typeInput?.type === "TEXTAREA")
        inputs.push(
          <Textarea
            key={key}
            placeholder={typeInput?.placeholder}
            label={labels[key]}
            error={form.errors[key]}
            value={form.values[key] as string}
            onChange={(event) => {
              const value = event.currentTarget.value;
              form.setFieldValue(key, event.currentTarget.value);
              callback(value);
            }}
          />
        );
      else if (typeInput?.type === "MULTISELECT")
        inputs.push(
          <MultiSelect
            key={key}
            label={labels[key]}
            data={data || []}
            error={form.errors[key]}
            value={form.values[key] as string[]}
            onChange={(value) => {
              form.setFieldValue(key, value);
              callback(value);
            }}
          />
        );
      else if (typeInput?.type === "AUTOCOMPLETE")
        inputs.push(
          <Autocomplete
            key={key}
            limit={typeInput.limit}
            placeholder={typeInput.placeholder}
            label={labels[key]}
            data={data || []}
            error={form.errors[key]}
            value={form.values[key] as string}
            onChange={(value) => {
              form.setFieldValue(key, value);
              callback(value);
            }}
          />
        );
      else if (typeInput?.type === "TIME")
        inputs.push(
          <TimeInput
            key={key}
            label={labels[key]}
            error={form.errors[key]}
            value={form.values[key] as Date}
            onChange={(value) => {
              form.setFieldValue(key, value);
              callback(value);
            }}
          />
        );
      else
        inputs.push(
          <TextInput
            key={key}
            placeholder={typeInput?.placeholder}
            label={labels[key]}
            error={form.errors[key]}
            value={form.values[key] as string}
            onChange={(event) => {
              const value = event.currentTarget.value;
              form.setFieldValue(key, value);
              callback(value);
            }}
          />
        );
      return inputs;
    }, []);
  }, [form, initialValues, labels, listData, onChange, typeInputs]);

  useEffect(() => {
    if (setForm) setForm(form);
  }, [form, setForm]);

  return <>{inputs}</>;
};
