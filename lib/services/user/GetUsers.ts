import { prisma } from "@lib/prisma";
import { z } from "zod";

const GetUsers = z
  .function()
  .args(z.string().optional())
  .implement(async (role) => {
    return prisma.user
      .findMany({
        where: {
          role,
        },
        select: {
          id: true,
          username: true,
          full_name: true,
          role: true,
        },
      })
      .catch(() => []);
  });

export default GetUsers;
