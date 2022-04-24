import { prisma } from "@lib/prisma";
import { z } from "zod";

export const HideWorkSchedule = z
  .function()
  .args(z.string())
  .implement(async (id) => {
    return prisma.workSchedule
      .update({
        where: {
          id: id,
        },
        data: {
          hidden: true,
        },
      })
      .then(() => true)
      .catch(() => false);
  });
