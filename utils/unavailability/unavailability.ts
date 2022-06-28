import { Unavailability, User } from "@prisma/client";
import dayjs from "dayjs";
import { z } from "zod";

export type UnavailabilityItemForm = {
  startDate: Date;
  endDate: Date;
};

export const ZodUnavailabilityItemForm = z.object({
  startDate: z
    .date()
    .or(z.string().transform((value) => dayjs(value).toDate())),
  endDate: z.date().or(z.string().transform((value) => dayjs(value).toDate())),
});

export type UnavailabilityFull = Unavailability & {
  user: User;
};
