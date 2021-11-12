import { CourseEventSimplified } from "./CourseEvent";
import { InternalWorkEventSimplified } from "./InternalWorkEvent";
import { UnavailabilityEventSimplified } from "./UnavailabilityEvent";

export enum Event {
  Course = "Course",
  InternalWork = "InternalWork",
  Unavailability = "Unavailability",
}

export type AllEventsSimplified = {
  courses: CourseEventSimplified[];
  internalWorks: InternalWorkEventSimplified[];
  unavailabilities: UnavailabilityEventSimplified[];
};
