import { prisma } from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const FindWorkScheduleTask = z
  .function()
  .args(
    z.object({
      workScheduleId: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      acceptEqualDate: z.boolean().optional(),
      activeOnly: z.boolean().optional(),
    })
  )
  .implement(
    async ({
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
            OR: [
              {
                startDate: {
                  [greaterOperator]: startDate,
                  [lesserOperator]: endDate,
                },
              },
              {
                endDate: {
                  [greaterOperator]: startDate,
                  [lesserOperator]: endDate,
                },
              },
              {
                AND: [
                  {
                    startDate: {
                      [lesserOperator]: startDate,
                    },
                  },
                  {
                    endDate: {
                      [greaterOperator]: endDate,
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
