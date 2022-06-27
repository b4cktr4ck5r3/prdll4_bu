import { InternalWorkFull } from "@utils/internalWork";
import axios from "axios";

export default async function FetchInternalWorks(
  startDate?: Date,
  endDate?: Date,
  userId?: string,
  validated?: boolean,
  withoutStatus?: boolean
) {
  return axios
    .get<InternalWorkFull[]>("/api/internalWork", {
      params: { startDate, endDate, userId, validated, withoutStatus },
    })
    .then((res) => res.data);
}
