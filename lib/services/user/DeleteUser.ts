import { prisma } from "@lib/prisma";
import { z } from "zod";

const DeleteUser = z
  .function()
  .args(z.string())
  .implement(async (userId) => {
    return prisma.user.delete({
      where: {
        id: userId,
      },
    });
  });

export default DeleteUser;
