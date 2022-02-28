import { WorkSchedule } from "@prisma/client";
import axios from "axios";

export default async function FetchWorkScheduleTasks(workScheduleId?: string) {
  return axios
    .get<WorkSchedule[]>("/api/workScheduleTask", {
      params: { workScheduleId },
    })
    .then((res) => res.data);
}
