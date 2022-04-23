import { prisma } from "@lib/prisma";
import { SafeUserSelect } from "@utils/user";
import { z } from "zod";

const FindTimeReport = z
  .function()
  .args(
    z.object({
      userId: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      validated: z.boolean().optional(),
    })
  )
  .implement(
    async ({ userId, startDate = new Date(1970), endDate, validated }) => {
      return prisma.timeReport
        .findMany({
          where: {
            userId,
            validated,
            OR: [
              {
                startDate: {
                  gte: startDate,
                  lte: endDate,
                },
              },
              {
                endDate: {
                  gte: startDate,
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
          },
          include: {
            workScheduleTasks: true,
            internalWorks: true,
            extraItems: true,
            user: {
              select: SafeUserSelect,
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
