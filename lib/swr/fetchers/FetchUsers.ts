import { UserFull } from "@utils/user";
import axios from "axios";

export default async function FetchUsers() {
  return axios
    .get<UserFull[]>("/api/user?complete=true")
    .then((res) => res.data);
}
