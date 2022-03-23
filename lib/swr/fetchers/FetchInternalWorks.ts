import { InternalWorkFull } from "@utils/internalWork";
import axios from "axios";

export default async function FetchInternalWorks(
  startDate?: Date,
  endDate?: Date,
  validated?: boolean
) {
  return axios
    .get<InternalWorkFull[]>("/api/internalWork", {
      params: { startDate, endDate, validated },
    })
    .then((res) => res.data);
}
