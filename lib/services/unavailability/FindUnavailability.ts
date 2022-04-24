import { prisma } from "@lib/prisma";
import { SafeUserSelect } from "@utils/user";
import { z } from "zod";

export const FindUnavailability = z
  .function()
  .args(
    z.object({
      userId: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      acceptEqualDate: z.boolean().optional(),
    })
  )
  .implement(
    async ({
      userId,
      startDate = new Date(1970),
      endDate,
      acceptEqualDate = true,
    }) => {
      const lesserOperator = acceptEqualDate ? "lte" : "lt";
      const greaterOperator = acceptEqualDate ? "gte" : "gt";

      return prisma.unavailability
        .findMany({
          where: {
            userId,
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
          },
          orderBy: [
            {
              endDate: "desc",
            },
            {
              startDate: "desc",
            },
          ],
          include: {
            user: {
              select: SafeUserSelect,
            },
          },
        })
        .catch(() => []);
    }
  );
