import { WorkScheduleTaskFull } from "@utils/workScheduleTask";
import axios from "axios";

export default async function FetchWorkScheduleTasks(
  workScheduleId?: string,
  startDate?: Date,
  endDate?: Date,
  acceptEqualDate?: boolean,
  activeOnly?: boolean
) {
  return axios
    .get<WorkScheduleTaskFull[]>("/api/workScheduleTask", {
      params: {
        workScheduleId,
        startDate,
        endDate,
        acceptEqualDate,
        activeOnly,
      },
    })
    .then((res) => res.data);
}
