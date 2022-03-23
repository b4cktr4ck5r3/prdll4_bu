import { InternalWork, User } from "@prisma/client";
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
  validated: z.boolean().optional(),
});

export type InternalWorkFull = InternalWork & {
  user?: User;
};
