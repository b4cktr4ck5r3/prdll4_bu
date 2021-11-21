import { prisma } from "@lib/prisma";
import { z } from "zod";

const CreateUnavailability = z
  .function()
  .args(z.string(), z.date(), z.date())
  .implement(async (userId, startDate, endDate) => {
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

export default CreateUnavailability;
