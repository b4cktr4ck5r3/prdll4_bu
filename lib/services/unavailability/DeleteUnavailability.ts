import { prisma } from "@lib/prisma";
import { z } from "zod";

export const DeleteUnavailability = z
  .function()
  .args(z.string())
  .implement(async (unavailabilityId) => {
    return prisma.unavailability
      .delete({
        where: {
          id: unavailabilityId,
        },
      })
      .then(() => true)
      .catch(() => false);
  });
