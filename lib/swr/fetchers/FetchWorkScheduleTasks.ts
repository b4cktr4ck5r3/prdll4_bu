import { WorkScheduleTaskFull } from "@utils/workScheduleTask";
import axios from "axios";

export default async function FetchWorkScheduleTasks(
  workScheduleId?: string,
  startDate?: Date,
  endDate?: Date
) {
  return axios
    .get<WorkScheduleTaskFull[]>("/api/workScheduleTask", {
      params: { workScheduleId, startDate, endDate },
    })
    .then((res) => res.data);
}
