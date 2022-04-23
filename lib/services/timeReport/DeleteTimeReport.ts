import { prisma } from "@lib/prisma";
import { z } from "zod";

export const DeleteTimeReport = z
  .function()
  .args(z.string())
  .implement(async (timeReportId) => {
    const document = await prisma.timeReport.findUnique({
      where: { id: timeReportId },
    });

    if (document && !document.validated)
      return prisma.timeReport
        .delete({
          where: {
            id: timeReportId,
          },
        })
        .then(() => true)
        .catch(() => false);
    else return Promise.resolve(false);
  });
