import { DateSimplified } from "./Date";

export type UnavailabilityEvent = {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
};

export type UnavailabilityEventSimplified = UnavailabilityEvent & {
  date: DateSimplified;
};

export type UnavailabilityEventDTO = {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
};
