import { z } from "zod";

export type WorkScheduleItemForm = {
  name: string;
  startDate: Date;
  endDate: Date;
};

export const ZodWorkScheduleItemForm = z.object({
  name: z.string(),
  startDate: z.date().or(z.string().transform((value) => new Date(value))),
  endDate: z.date().or(z.string().transform((value) => new Date(value))),
});
