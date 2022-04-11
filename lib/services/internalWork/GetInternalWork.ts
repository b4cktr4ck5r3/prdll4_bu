import { prisma } from "@lib/prisma";
import { z } from "zod";

const GetInternalWork = z
  .function()
  .args(z.date().optional(), z.date().optional(), z.boolean().optional())
  .implement(async (startDate = new Date(1970), endDate, validated) => {
    return prisma.internalWork
      .findMany({
        where: {
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
      })
      .catch(() => []);
  });

export default GetInternalWork;
