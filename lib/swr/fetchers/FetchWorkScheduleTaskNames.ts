import { WorkScheduleTaskName } from "@prisma/client";
import axios from "axios";

export default async function FetchWorkScheduleTaskNames() {
  return axios
    .get<WorkScheduleTaskName[]>("/api/workScheduleTaskName")
    .then((res) => res.data);
}
