import { prisma } from "@lib/prisma";
import { z } from "zod";

const FindInternalWork = z
  .function()
  .args(
    z.string(),
    z.date().optional(),
    z.date().optional(),
    z.boolean().optional()
  )
  .implement(async (userId, startDate, endDate, validated) => {
    return prisma.internalWork
      .findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
          validated,
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
        orderBy: [
          {
            date: "desc",
          },
        ],
      })
      .catch(() => []);
  });

export default FindInternalWork;
