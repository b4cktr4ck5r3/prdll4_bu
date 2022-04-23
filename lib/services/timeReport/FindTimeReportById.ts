import { prisma } from "@lib/prisma";
import { z } from "zod";

export const FindTimeReportById = z
  .function()
  .args(z.string())
  .implement(async (id) => {
    return prisma.timeReport
      .findUnique({
        where: {
          id,
        },
      })
      .catch(() => Promise.resolve(null));
  });
