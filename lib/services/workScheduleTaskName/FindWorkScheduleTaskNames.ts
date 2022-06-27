import { prisma } from "@lib/prisma";
import { z } from "zod";

export const FindWorkScheduleTaskNames = z
  .function()
  .args(z.object({ name: z.string().optional() }))
  .implement(async ({ name }) => {
    return prisma.workScheduleTaskName
      .findMany({
        where: { name },
        orderBy: { name: "asc" },
      })
      .catch(() => []);
  });
