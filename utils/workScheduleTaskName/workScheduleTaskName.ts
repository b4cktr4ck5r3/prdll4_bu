import { z } from "zod";

export type WorkScheduleTaskNameItemForm = {
  name: string;
};

export const ZodWorkScheduleTaskNameItemForm = z.object({
  name: z.string(),
});
