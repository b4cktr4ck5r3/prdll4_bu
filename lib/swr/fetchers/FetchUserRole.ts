import { Role } from "@utils/user";
import axios from "axios";

export default async function FetchUserRole() {
  return axios
    .get<Record<"role", Role>>("/api/user/role")
    .then((res) => res.data.role);
}
