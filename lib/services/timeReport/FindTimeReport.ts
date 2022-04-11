import { prisma } from "@lib/prisma";
import { z } from "zod";

const FindTimeReport = z
  .function()
  .args(
    z.string(),
    z.date().optional(),
    z.date().optional(),
    z.boolean().optional(),
    z.boolean().optional()
  )
  .implement(
    async (
      userId,
      startDate = new Date(1970),
      endDate,
      validated,
      acceptEqualDate = true
    ) => {
      const lesserOperator = acceptEqualDate ? "lte" : "lt";
      const greaterOperator = acceptEqualDate ? "gte" : "gt";

      return prisma.timeReport
        .findMany({
          where: {
            userId,
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
            validated,
          },
          include: {
            workScheduleTasks: true,
            internalWorks: true,
            extraItems: true,
            user: {
              select: {
                id: true,
                username: true,
                password: false,
                full_name: true,
                role: true,
                active: true,
              },
            },
          },
          orderBy: [
            {
              endDate: "desc",
            },
            {
              startDate: "desc",
            },
          ],
        })
        .catch(() => []);
    }
  );

export default FindTimeReport;
