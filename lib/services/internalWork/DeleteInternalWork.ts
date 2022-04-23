import { prisma } from "@lib/prisma";
import { z } from "zod";

export const DeleteInternalWork = z
  .function()
  .args(z.string())
  .implement(async (internalWorkId) => {
    return prisma.internalWork
      .delete({
        where: {
          id: internalWorkId,
        },
      })
      .then(() => true)
      .catch(() => false);
  });
