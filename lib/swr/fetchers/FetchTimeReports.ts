import { TimeReportFull } from "@utils/timeReport";
import axios from "axios";

export default async function FetchTimeReports(
  userId?: string,
  startDate?: Date,
  endDate?: Date
) {
  return axios
    .get<TimeReportFull[]>("/api/timeReport", {
      params: {
        userId,
        startDate,
        endDate,
      },
    })
    .then((res) => res.data);
}
