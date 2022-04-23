import { prisma } from "@lib/prisma";
import { z } from "zod";

export const CreateWorkScheduleTask = z
  .function()
  .args(z.string(), z.string(), z.string().array(), z.date(), z.date())
  .implement(async (planningID, name, userIDs, startDate, endDate) => {
    return prisma.workScheduleTask
      .create({
        data: {
          name,
          startDate,
          endDate,
          schedule: {
            connect: { id: planningID },
          },
          users: {
            connect: userIDs.map((id) => ({ id })),
          },
        },
      })
      .then(() => true)
      .catch(() => false);
  });
