import { prisma } from "@lib/prisma";
import { SafeUserSelect } from "@utils/user";
import { z } from "zod";

export const FindInternalWorkById = z
  .function()
  .args(z.string())
  .implement(async (id) => {
    return prisma.internalWork
      .findUnique({
        where: {
          id,
        },
        include: {
          status: true,
          user: {
            select: SafeUserSelect,
          },
        },
      })
      .catch(() => Promise.resolve(null));
  });
