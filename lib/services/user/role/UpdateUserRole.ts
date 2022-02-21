import { prisma } from "@lib/prisma";
import { ZodRoleEnum } from "@utils/user";
import { z } from "zod";

const UpdateUserRole = z
  .function()
  .args(z.string(), ZodRoleEnum)
  .implement(async (userId, role) => {
    return prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          role,
        },
      })
      .then(() => true)
      .catch(() => false);
  });

export default UpdateUserRole;
