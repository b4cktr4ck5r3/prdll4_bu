import { prisma } from "@lib/prisma";
import { SafeUserSelect } from "@utils/user";
import { z } from "zod";

export const FindUserById = z
  .function()
  .args(z.string())
  .implement(async (id) => {
    return prisma.user
      .findUnique({
        where: {
          id,
        },
        select: SafeUserSelect,
      })
      .catch(() => Promise.resolve(null));
  });
