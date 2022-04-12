import { TimeReportFull } from "@utils/timeReport";
import axios from "axios";

export default async function FetchTimeReports(
  userId?: string,
  startDate?: Date,
  endDate?: Date
) {
  return axios
    .get<TimeReportFull[]>(`/api/user/${userId}/timeReport`, {
      params: {
        startDate,
        endDate,
      },
    })
    .then((res) => res.data);
}
