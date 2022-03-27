import { prisma } from "@lib/prisma";
import { ZodUserUpdate } from "@utils/user";
import { z } from "zod";

const UpdateUser = z
  .function()
  .args(z.string(), ZodUserUpdate.partial())
  .implement(async (id, data) => {
    return prisma.user
      .update({
        data,
        where: {
          id: id,
        },
      })
      .then(() => true)
      .catch(() => false);
  });

export default UpdateUser;
