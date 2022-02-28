import { prisma } from "@lib/prisma";
import { z } from "zod";

const GetUsers = z
  .function()
  .args(z.boolean().optional(), z.string().optional())
  .implement(async (full = false, role) => {
    return prisma.user
      .findMany({
        where: {
          role,
        },
        select: {
          InternalWork: full,
          WorkScheduleTask: full,
          Unavailability: full,
          id: true,
          username: true,
          password: false,
          full_name: true,
          role: true,
        },
      })
      .catch(() => []);
  });

export default GetUsers;
