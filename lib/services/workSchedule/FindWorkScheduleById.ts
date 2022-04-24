import { prisma } from "@lib/prisma";
import { z } from "zod";

export const FindWorkScheduleById = z
  .function()
  .args(z.string())
  .implement(async (id) => {
    return prisma.workSchedule
      .findUnique({
        where: {
          id,
        },
      })
      .catch(() => Promise.resolve(null));
  });
