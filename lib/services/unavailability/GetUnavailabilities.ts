import { prisma } from "@lib/prisma";
import { z } from "zod";

const GetUnavailabilities = z
  .function()
  .args(z.date().optional(), z.date().optional(), z.boolean().optional())
  .implement(async (startDate, endDate, acceptEqualDate = true) => {
    const lesserOperator = acceptEqualDate ? "lte" : "lt";
    const greaterOperator = acceptEqualDate ? "gte" : "gt";

    return prisma.unavailability
      .findMany({
        where: {
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
      })
      .catch(() => []);
  });

export default GetUnavailabilities;
