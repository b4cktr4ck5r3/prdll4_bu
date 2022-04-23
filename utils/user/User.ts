import { InternalWork, Unavailability, WorkScheduleTask } from "@prisma/client";

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

export const SafeUserSelect = {
  id: true,
  username: true,
  password: false,
  full_name: true,
  role: true,
  active: true,
};
