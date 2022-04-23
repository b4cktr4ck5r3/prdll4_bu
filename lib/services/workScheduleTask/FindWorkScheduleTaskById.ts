import { prisma } from "@lib/prisma";
import { z } from "zod";

export const FindWorkScheduleTaskById = z
  .function()
  .args(z.string())
  .implement(async (id) => {
    return prisma.workScheduleTask
      .findUnique({
        where: {
          id,
        },
      })
      .catch(() => Promise.resolve(null));
  });
