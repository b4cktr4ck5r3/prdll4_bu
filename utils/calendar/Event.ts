import { CourseEventSimplified } from "./CourseEvent";
import { InternalWorkEventSimplified } from "./InternalWorkEvent";
import { UnavailabilityEventSimplified } from "./UnavailabilityEvent";

export enum Event {
  Course = "Course",
  InternalWork = "InternalWork",
  Unavailability = "Unavailability",
}

export function GetEventLabel(event: Event) {
  if (event === Event.Course) return "Formation";
  else if (event === Event.InternalWork) return "Travail Interne";
  else if (event === Event.Unavailability) return "Indisponible";
  else return "";
}

export type AllEventsSimplified = {
  courses: CourseEventSimplified[];
  internalWorks: InternalWorkEventSimplified[];
  unavailabilities: UnavailabilityEventSimplified[];
};
