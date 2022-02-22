import { z } from "zod";

export type UnavailabilityItemForm = {
  startDate: Date;
  endDate: Date;
};

  export const ZodUnavailabilityItemForm = z.object({
    startDate: z.date().or(z.string().transform((value) => new Date(value))),
    endDate: z.date().or(z.string().transform((value) => new Date(value)))
})