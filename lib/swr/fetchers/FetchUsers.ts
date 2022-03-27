import { UserFull } from "@utils/user";
import axios from "axios";

export default async function FetchUsers(active: boolean | undefined = true) {
  const parameters = ["complete=true"];
  if (active === true) parameters.push("active=true");
  else if (active === false) parameters.push("active=false");

  return axios
    .get<UserFull[]>(`/api/user?${parameters.join("&")}`)
    .then((res) => res.data);
}
