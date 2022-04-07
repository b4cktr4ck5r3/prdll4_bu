import { UnavailabilityFull } from "@utils/unavailability";
import axios from "axios";

export default async function FetchUnavailabilities(
  startDate?: Date,
  endDate?: Date,
  acceptEqualDate?: boolean
) {
  return axios
    .get<UnavailabilityFull[]>("/api/unavailability", {
      params: {
        startDate,
        endDate,
        acceptEqualDate: acceptEqualDate ? undefined : "false",
      },
    })
    .then((res) => res.data);
}
