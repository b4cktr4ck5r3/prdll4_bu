import { prisma } from "@lib/prisma";
import { ZodUnavailabilityItemForm } from "@utils/unavailability/unavailability";
import { z } from "zod";

export const UpdateUnavailability = z
  .function()
  .args(z.string(), ZodUnavailabilityItemForm)
  .implement(async (id, data) => {
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
