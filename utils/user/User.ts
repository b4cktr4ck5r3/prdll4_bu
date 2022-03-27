import { InternalWork, Unavailability, WorkScheduleTask } from "@prisma/client";
import { z } from "zod";

export type UserSimplified = {
  id: string;
  username: string;
  full_name: string;
  role: string;
  active: boolean;
};

export type UserFull = {
  InternalWork: InternalWork[];
  WorkScheduleTask: WorkScheduleTask[];
  Unavailability: Unavailability[];
  id: string;
  username: string;
  full_name: string;
  role: string;
  active: boolean;
};

export const ZodUserUpdate = z.object({
  active: z.boolean().optional(),
});
