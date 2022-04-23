import { prisma } from "@lib/prisma";
import { z } from "zod";

export const UpdateUserStatus = z
  .function()
  .args(z.string(), z.boolean())
  .implement(async (userId, status) => {
    return prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          active: status,
        },
      })
      .catch(() => Promise.resolve(null));
  });
