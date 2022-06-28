import {
  TimeReport,
  User,
  WorkSchedule,
  WorkScheduleTask,
} from "@prisma/client";
import dayjs from "dayjs";
import { z } from "zod";

export type WorkScheduleTaskItemForm = {
  name: string;
  workScheduleId: string;
  users: string[];
  startDate: Date;
  endDate: Date;
};

export const ZodWorkScheduleTaskItemForm = z.object({
  name: z.string(),
  workScheduleId: z.string(),
  users: z.array(z.string()),
  startDate: z
    .date()
    .or(z.string().transform((value) => dayjs(value).toDate())),
  endDate: z.date().or(z.string().transform((value) => dayjs(value).toDate())),
});

export type WorkScheduleTaskFull = WorkScheduleTask & {
  schedule: WorkSchedule;
  users: User[];
  TimeReports: TimeReport[];
};
