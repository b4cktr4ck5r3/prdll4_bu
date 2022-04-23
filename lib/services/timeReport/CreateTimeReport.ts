import { prisma } from "@lib/prisma";
import FindTimeReport from "@lib/services/timeReport/FindTimeReport";
import dayjs from "dayjs";
import { z } from "zod";

const CreateTimeReport = z
  .function()
  .args(z.string(), z.date(), z.date())
  .implement(async (userId = "", startDate, endDate) => {
    startDate = dayjs(startDate)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate();
    endDate = dayjs(endDate)
      .hour(23)
      .minute(59)
      .second(59)
      .millisecond(999)
      .toDate();

    if (
      endDate.getTime() < startDate.getTime() ||
      (await FindTimeReport({ userId, startDate, endDate })).length > 0
    )
      return Promise.resolve(false);

    const workScheduleTasks = await prisma.workScheduleTask.findMany({
      where: {
        startDate: {
          lte: endDate,
        },
        TimeReports: {
          none: {
            userId,
          },
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
        status: {
          validated: true,
        },
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
