import { prisma } from "@lib/prisma";
import { FindUnavailability } from "@lib/services/unavailability";
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
    const hasUnavailabilities = await Promise.all(
      userIDs.map((userId) =>
        FindUnavailability({
          startDate,
          endDate,
          userId,
          acceptEqualDate: false,
        }).then((unavailabilities) => unavailabilities.length > 0)
      )
    ).then((list) => list.find(Boolean));
    if (
      !planning ||
      hasUnavailabilities ||
      startDate.getTime() > endDate.getTime()
    )
      return Promise.resolve(false);
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
