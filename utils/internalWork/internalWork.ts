import { InternalWork, InternalWorkStatus, User } from "@prisma/client";
import dayjs from "dayjs";
import { z } from "zod";

export type InternalWorkItemForm = {
  date: Date;
  description: string;
  duration: number;
};

export const ZodInternalWorkItemForm = z.object({
  date: z.date().or(z.string().transform((value) => dayjs(value).toDate())),
  description: z.string(),
  duration: z.number(),
});

export type InternalWorkFull = InternalWork & {
  user?: User;
  status?: InternalWorkStatus;
};
