import { InternalWork, Unavailability, WorkScheduleTask } from "@prisma/client";
import axios from "axios";

export type UserFull = {
  InternalWork: InternalWork[];
  WorkScheduleTask: WorkScheduleTask[];
  Unavailability: Unavailability[];
  id: string;
  username: string;
  full_name: string;
  role: string;
};

export default async function FetchUsers() {
  return axios
    .get<UserFull[]>("/api/user?complete=true")
    .then((res) => res.data);
}
