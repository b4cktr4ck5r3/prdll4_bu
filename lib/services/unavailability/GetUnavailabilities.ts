import { prisma } from "@lib/prisma";
import { z } from "zod";

const GetUnavailabilities = z
  .function()
  .args(z.boolean().optional(), z.date().optional(), z.date().optional())
  .implement(async (full = false, startDate, endDate) => {
    return prisma.unavailability
      .findMany({
        where: {
          startDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          user: full,
        },
      })
      .catch(() => []);
  });

export default GetUnavailabilities;
