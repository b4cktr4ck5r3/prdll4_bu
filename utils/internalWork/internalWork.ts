import { z } from "zod";

export type InternalWorkItemForm = {
    date: Date;
    description: string;
    duration: number;
  };

  export const ZodInternalWorkItemForm = z.object({
    date: z.date().or(z.string().transform((value) => new Date(value))),
    description: z.string(),
    duration: z.number(),
  })