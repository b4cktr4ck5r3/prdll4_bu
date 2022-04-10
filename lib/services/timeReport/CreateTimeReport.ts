import { prisma } from "@lib/prisma";
import { z } from "zod";

const CreateTimeReport = z
  .function()
  .args(z.string(), z.date(), z.date())
  .implement(async (userId = "", startDate, endDate) => {
    const workScheduleTasks = await prisma.workScheduleTask.findMany({
      where: {
        startDate: {
          lte: endDate,
        },
        TimeReport: {
          is: null,
        },
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    const internalWorks = await prisma.internalWork.findMany({
      where: {
        userId,
        TimeReport: {
          is: null,
        },
        validated: true,
        date: {
          lte: endDate,
        },
      },
      select: {
        id: true,
      },
    });

    return prisma.timeReport
      .create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          validated: false,
          startDate,
          endDate,
          internalWorks: {
            connect: internalWorks.map(({ id }) => ({ id })),
          },
          workScheduleTasks: {
            connect: workScheduleTasks.map(({ id }) => ({ id })),
          },
        },
      })
      .then((doc) => doc.id)
      .catch(() => false);
  });

export default CreateTimeReport;
