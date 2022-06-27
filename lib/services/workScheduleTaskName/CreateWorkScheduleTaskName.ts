import { prisma } from "@lib/prisma";
import { z } from "zod";

export const CreateWorkScheduleTaskName = z
  .function()
  .args(z.string())
  .implement(async (name) => {
    return prisma.workScheduleTaskName
      .create({
        data: {
          name,
        },
      })
      .then(() => true)
      .catch(() => false);
  });
