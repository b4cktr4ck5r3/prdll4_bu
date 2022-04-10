import {
  InternalWork,
  TimeReport,
  TimeReportExtra,
  User,
  WorkScheduleTask,
} from "@prisma/client";
import { z } from "zod";

export type TimeReportItemForm = {
  userId: string;
  startDate: Date;
  endDate: Date;
};

export const ZodTimeReportItemForm = z.object({
  userId: z.string(),
  startDate: z.date().or(z.string().transform((value) => new Date(value))),
  endDate: z.date().or(z.string().transform((value) => new Date(value))),
});

export type TimeReportFull = TimeReport & {
  user?: User;
  workScheduleTasks: WorkScheduleTask[];
  internalWorks: InternalWork[];
  extraItems: TimeReportExtra[];
};
