import { prisma } from "@lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

export const UpdateUserPassword = z
  .function()
  .args(z.string(), z.string())
  .implement(async (userId, newPassword) => {
    return prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          password: await hash(newPassword, 12),
        },
      })
      .catch(() => Promise.resolve(null));
  });
