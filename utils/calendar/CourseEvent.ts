import { DateSimplified } from "./Date";

export type CourseEvent = {
  id: string;
};

export type CourseEventSimplified = CourseEvent & {
  date: DateSimplified;
};

export type CourseEventDTO = {
  id: string;
};
