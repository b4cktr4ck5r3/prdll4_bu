import { prisma } from "@lib/prisma";
import { z } from "zod";

const CreateInternalWork = z
  .function()
  .args(z.string(), z.date(), z.number(), z.string())
  .implement(async (userId, date, duration, description) => {
    return prisma.internalWork
      .create({
        data: {
          userId,
          date,
          duration,
          description,
          validated: false,
        },
      })
      .then(() => true)
      .catch(() => false);
  });

export default CreateInternalWork;
