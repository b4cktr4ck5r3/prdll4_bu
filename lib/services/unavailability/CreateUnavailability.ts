import { prisma } from "@lib/prisma";
import { z } from "zod";

export const CreateUnavailability = z
  .function()
  .args(z.string(), z.date(), z.date())
  .implement(async (userId, startDate, endDate) => {
    if (startDate.getTime() > endDate.getTime()) return Promise.resolve(false);
    return prisma.unavailability
      .create({
        data: {
          userId,
          startDate,
          endDate,
        },
      })
      .then(() => true)
      .catch(() => false);
  });
