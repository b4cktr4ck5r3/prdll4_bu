import { prisma } from "@lib/prisma";
import { z } from "zod";

export const DeclineInternalWork = z
  .function()
  .args(z.string())
  .implement(async (id) => {
    return prisma.internalWork
      .update({
        where: {
          id: id,
        },
        data: {
          status: {
            create: {
              validated: false,
            },
          },
        },
      })
      .then(() => true)
      .catch(() => false);
  });
