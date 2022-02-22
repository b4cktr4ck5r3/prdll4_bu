import { z } from "zod";

export type UnavailabilityItemForm = {
  startDate: Date;
  endDate: Date;
};

  export const ZodUnavailabilityItemForm = z.object({
    startDate: z.date(),
    endDate: z.date()
  })