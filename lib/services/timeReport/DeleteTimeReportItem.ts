import { prisma } from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const DeleteTimeReportItem = z
  .function()
  .args(z.string(), z.enum(["IW", "WST", "Extra"]), z.string())
  .implement(async (timeReportId, type, itemId) => {
    let action: Prisma.SelectSubset<
      Prisma.TimeReportUpdateArgs,
      Prisma.TimeReportUpdateArgs
    >["data"];
    if (type === "IW")
      action = {
        internalWorks: {
          disconnect: { id: itemId },
        },
      };
    else if (type === "WST")
      action = {
        workScheduleTasks: {
          disconnect: { id: itemId },
        },
      };
    else if (type === "Extra")
      action = {
        extraItems: {
          disconnect: { id: itemId },
        },
      };
    else return Promise.resolve(false);

    return prisma.timeReport
      .update({
        where: {
          id: timeReportId,
        },
        data: action,
      })
      .then(() => true)
      .catch(() => false);
  });

export default DeleteTimeReportItem;
