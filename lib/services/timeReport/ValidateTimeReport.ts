import { prisma } from "@lib/prisma";
import { CalculDeclaredHours } from "@utils/timeReport";
import { z } from "zod";

const ValidateTimeReport = z
  .function()
  .args(z.string())
  .implement(async (timeReportId) => {
    const currentDocument = await prisma.timeReport.findUnique({
      where: { id: timeReportId },
      include: {
        extraItems: true,
        internalWorks: true,
        workScheduleTasks: true,
      },
    });

    if (!currentDocument || currentDocument.validated)
      return Promise.resolve(false);
    const { declaredHours } = CalculDeclaredHours(
      currentDocument.internalWorks,
      currentDocument.workScheduleTasks,
      currentDocument.extraItems
    );

    return prisma.timeReport
      .update({
        where: {
          id: timeReportId,
        },
        data: {
          validated: true,
          nbHoursValidated: declaredHours,
        },
      })
      .then(() => true)
      .catch(() => false);
  });

export default ValidateTimeReport;
