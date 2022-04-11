import { prisma } from "@lib/prisma";
import { z } from "zod";

const FindUnavailability = z
  .function()
  .args(
    z.string(),
    z.date().optional(),
    z.date().optional(),
    z.boolean().optional()
  )
  .implement(
    async (
      userId,
      startDate = new Date(1970),
      endDate,
      acceptEqualDate = true
    ) => {
      const lesserOperator = acceptEqualDate ? "lte" : "lt";
      const greaterOperator = acceptEqualDate ? "gte" : "gt";

      return prisma.unavailability
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

export default FindUnavailability;
