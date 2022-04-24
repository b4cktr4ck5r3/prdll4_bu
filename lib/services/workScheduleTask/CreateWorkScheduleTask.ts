import { prisma } from "@lib/prisma";
import { z } from "zod";

export const CreateWorkScheduleTask = z
  .function()
  .args(z.string(), z.string(), z.string().array(), z.date(), z.date())
  .implement(async (planningID, name, userIDs, startDate, endDate) => {
    const planning = await prisma.workSchedule.findUnique({
      where: {
        id: planningID,
      },
    });
    if (!planning) return Promise.resolve(false);
    if (startDate < planning.startDate)
      await prisma.workSchedule.update({
        where: { id: planningID },
        data: { startDate },
      });
    if (endDate > planning.endDate)
      await prisma.workSchedule.update({
        where: { id: planningID },
        data: { endDate },
      });

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
