import { WorkSchedule } from "@prisma/client";
import axios from "axios";

export default async function FetchPlannings(hidden?: boolean) {
  return axios
    .get<WorkSchedule[]>("/api/workSchedule", {
      params: { hidden },
    })
    .then((res) => res.data);
}
