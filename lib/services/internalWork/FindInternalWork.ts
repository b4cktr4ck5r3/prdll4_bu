import { prisma } from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { SafeUserSelect } from "@utils/user";
import { z } from "zod";

export const FindInternalWork = z
  .function()
  .args(
    z.object({
      userId: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      validated: z.boolean().optional(),
      withoutStatus: z.boolean().optional(),
    })
  )
  .implement(
    async ({
      userId,
      startDate = new Date(1970),
      endDate,
      validated,
      withoutStatus,
    }) => {
      let status:
        | Prisma.InternalWorkStatusRelationFilter
        | Prisma.InternalWorkStatusWhereInput
        | undefined = undefined;
      if (withoutStatus)
        status = {
          is: null,
        };
      else if (typeof validated !== "undefined")
        status = {
          validated,
        };

      return prisma.internalWork
        .findMany({
          where: {
            userId,
            date: {
              gte: startDate,
              lte: endDate,
            },
            status,
          },
          include: {
            status: true,
            user: {
              select: SafeUserSelect,
            },
          },
          orderBy: [
            {
              date: "desc",
            },
          ],
        })
        .catch(() => []);
    }
  );
