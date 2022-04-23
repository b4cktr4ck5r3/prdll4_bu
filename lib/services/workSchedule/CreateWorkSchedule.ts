import { prisma } from "@lib/prisma";
import { z } from "zod";

export const CreateWorkSchedule = z
  .function()
  .args(z.string(), z.date(), z.date())
  .implement(async (name, startDate, endDate) => {
    return prisma.workSchedule
      .create({
        data: {
          name,
          startDate,
          endDate,
        },
      })
      .then(() => true)
      .catch(() => false);
  });
