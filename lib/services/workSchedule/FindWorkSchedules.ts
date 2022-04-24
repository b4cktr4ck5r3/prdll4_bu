import { prisma } from "@lib/prisma";
import { z } from "zod";

export const FindWorkSchedules = z
  .function()
  .args(
    z.object({
      hidden: z.boolean().optional(),
    })
  )
  .implement(async ({ hidden }) => {
    return prisma.workSchedule
      .findMany({
        where: {
          hidden,
        },
      })
      .catch(() => []);
  });
