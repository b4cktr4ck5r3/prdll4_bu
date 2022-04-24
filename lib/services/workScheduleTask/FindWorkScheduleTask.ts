import { prisma } from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const FindWorkScheduleTask = z
  .function()
  .args(
    z.object({
      userId: z.string().optional(),
      workScheduleId: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      acceptEqualDate: z.boolean().optional(),
      activeOnly: z.boolean().optional(),
    })
  )
  .implement(
    async ({
      userId,
      workScheduleId,
      startDate = new Date(1970),
      endDate,
      acceptEqualDate = true,
      activeOnly,
    }) => {
      const lesserOperator = acceptEqualDate ? "lte" : "lt";
      const greaterOperator = acceptEqualDate ? "gte" : "gt";

      let activeState: Prisma.WorkScheduleTaskWhereInput = {};
      if (activeOnly) {
        activeState = {
          users: {
            some: {
              active: true,
            },
          },
          schedule: {
            hidden: false,
          },
        };
      }

      return prisma.workScheduleTask
        .findMany({
          where: {
            workScheduleId,
            users: {
              some: {
                id: userId,
              },
            },
            OR: [
              {
                startDate: {
                  gte: startDate,
                  [lesserOperator]: endDate,
                },
              },
              {
                endDate: {
                  [greaterOperator]: startDate,
                  lte: endDate,
                },
              },
              {
                AND: [
                  {
                    startDate: {
                      lte: startDate,
                    },
                  },
                  {
                    endDate: {
                      gte: endDate,
                    },
                  },
                ],
              },
            ],
            ...activeState,
          },
          include: {
            schedule: true,
            users: true,
            TimeReports: true,
          },
          orderBy: [
            {
              startDate: "asc",
            },
            {
              endDate: "asc",
            },
          ],
        })
        .catch(() => []);
    }
  );
