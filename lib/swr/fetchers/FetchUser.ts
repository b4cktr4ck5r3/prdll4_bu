import { UserFull } from "@utils/user";
import axios from "axios";

export function FetchUser(userId?: string) {
  if (!userId) return Promise.resolve(null);
  return axios.get<UserFull>(`/api/user/${userId}`).then((res) => res.data);
}
