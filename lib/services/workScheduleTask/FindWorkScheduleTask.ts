import { prisma } from "@lib/prisma";
import { z } from "zod";

export const FindWorkScheduleTask = z
  .function()
  .args(
    z.object({
      workScheduleId: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      acceptEqualDate: z.boolean().optional(),
    })
  )
  .implement(
    async ({
      workScheduleId,
      startDate = new Date(1970),
      endDate,
      acceptEqualDate = true,
    }) => {
      const lesserOperator = acceptEqualDate ? "lte" : "lt";
      const greaterOperator = acceptEqualDate ? "gte" : "gt";

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
