import { WorkSchedule } from "@prisma/client";
import axios from "axios";

export default async function FetchPlannings() {
  return axios.get<WorkSchedule[]>("/api/workSchedule").then((res) => res.data);
}
