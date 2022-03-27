import { prisma } from "@lib/prisma";
import { z } from "zod";

const FindUnavailability = z
  .function()
  .args(z.string(), z.date().optional(), z.date().optional())
  .implement(async (userId, startDate, endDate) => {
    return prisma.unavailability
      .findMany({
        where: {
          userId,
          startDate: {
            gte: startDate,
            lte: endDate,
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
  });

export default FindUnavailability;
