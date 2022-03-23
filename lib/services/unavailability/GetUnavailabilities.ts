import { prisma } from "@lib/prisma";
import { z } from "zod";

const GetUnavailabilities = z
  .function()
  .args(z.date().optional(), z.date().optional())
  .implement(async (startDate, endDate) => {
    return prisma.unavailability
      .findMany({
        where: {
          startDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              password: false,
              full_name: true,
              role: true,
            },
          },
        },
      })
      .catch(() => []);
  });

export default GetUnavailabilities;
