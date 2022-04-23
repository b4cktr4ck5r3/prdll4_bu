import { prisma } from "@lib/prisma";
import { z } from "zod";

export const DeleteWorkScheduleTask = z
  .function()
  .args(z.string())
  .implement(async (workScheduleTaskId) => {
    return prisma.workScheduleTask
      .delete({
        where: {
          id: workScheduleTaskId,
        },
      })
      .then(() => true)
      .catch(() => false);
  });
