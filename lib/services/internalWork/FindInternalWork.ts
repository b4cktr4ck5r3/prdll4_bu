import { prisma } from "@lib/prisma";
import { z } from "zod";

const FindInternalWork = z
  .function()
  .args(z.string(), z.date().optional(), z.date().optional())
  .implement(async (userId, startDate, endDate) => {
    return prisma.internalWork
      .findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      })
      .catch(() => []);
  });

export default FindInternalWork;
