import { prisma } from "@lib/prisma";
import { z } from "zod";

export const DeleteWorkScheduleTaskName = z
  .function()
  .args(z.string())
  .implement(async (workScheduleTaskNameId) => {
    return prisma.workScheduleTaskName
      .delete({
        where: {
          id: workScheduleTaskNameId,
        },
      })
      .then(() => true)
      .catch(() => false);
  });
