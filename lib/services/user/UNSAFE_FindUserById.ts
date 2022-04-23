import { prisma } from "@lib/prisma";
import { z } from "zod";

export const UNSAFE_FindUserById = z
  .function()
  .args(z.string())
  .implement(async (id) => {
    return prisma.user
      .findUnique({
        where: {
          id,
        },
      })
      .catch(() => Promise.resolve(null));
  });
