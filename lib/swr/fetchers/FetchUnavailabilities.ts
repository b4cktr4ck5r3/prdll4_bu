import { UnavailabilityFull } from "@utils/unavailability";
import axios from "axios";

export default async function FetchUnavailabilities(
  startDate?: Date,
  endDate?: Date
) {
  return axios
    .get<UnavailabilityFull[]>("/api/unavailability", {
      params: { startDate, endDate },
    })
    .then((res) => res.data);
}
