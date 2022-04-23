import { prisma } from "@lib/prisma";
import { SafeUserSelect } from "@utils/user";
import { z } from "zod";

export const FindUnavailabilityById = z
  .function()
  .args(z.string())
  .implement(async (id) => {
    return prisma.unavailability
      .findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: SafeUserSelect,
          },
        },
      })
      .catch(() => Promise.resolve(null));
  });
