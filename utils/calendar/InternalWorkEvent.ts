import { DateSimplified } from "./Date";

export type InternalWorkEvent = {
  id: string;
  userId: string;
  date: Date;
  description: string;
  duration: number;
  validated: boolean;
};

export type InternalWorkEventSimplified = Omit<InternalWorkEvent, "date"> & {
  date: DateSimplified;
};

export type InternalWorkEventDTO = {
  id: string;
  userId: string;
  date: string;
  description: string;
  duration: number;
  validated: boolean;
};
