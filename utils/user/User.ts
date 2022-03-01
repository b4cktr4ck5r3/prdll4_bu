import { InternalWork, Unavailability, WorkScheduleTask } from "@prisma/client";

export type UserSimplified = {
  id: string;
  username: string;
  full_name: string;
  role: string;
};

export type UserFull = {
  InternalWork: InternalWork[];
  WorkScheduleTask: WorkScheduleTask[];
  Unavailability: Unavailability[];
  id: string;
  username: string;
  full_name: string;
  role: string;
};
