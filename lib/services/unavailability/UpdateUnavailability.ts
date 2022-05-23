import { prisma } from "@lib/prisma";
import { ZodUnavailabilityItemForm } from "@utils/unavailability/unavailability";
import { z } from "zod";

export const UpdateUnavailability = z
  .function()
  .args(z.string(), ZodUnavailabilityItemForm)
  .implement(async (id, data) => {
    if (
      data.startDate &&
      data.endDate &&
      data.startDate.getTime() > data.endDate.getTime()
    )
      return Promise.resolve(false);
    return prisma.unavailability
      .update({
        data: data,
        where: {
          id: id,
        },
      })
      .then(() => true)
      .catch(() => false);
  });
