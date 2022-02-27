import { prisma } from "@lib/prisma";
import { ZodInternalWorkItemForm } from "@utils/internalWork";
import { z } from "zod";

const UpdateInternalWork = z
  .function()
  .args(z.string(), ZodInternalWorkItemForm)
  .implement(async (id, data) => {
    return prisma.internalWork
      .update({
          data: data,
          where: {
              id: id
          }
      })
      .then(() => true)
      .catch(() => false);
  });

export default UpdateInternalWork;
