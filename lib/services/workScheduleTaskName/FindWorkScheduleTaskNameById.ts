import { prisma } from "@lib/prisma";
import { z } from "zod";

export const FindWorkScheduleTaskNameById = z
  .function()
  .args(z.string())
  .implement(async (id) => {
    return prisma.workScheduleTaskName
      .findUnique({
        where: {
          id,
        },
      })
      .catch(() => Promise.resolve(null));
  });
