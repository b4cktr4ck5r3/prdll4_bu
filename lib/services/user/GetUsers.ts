import { prisma } from "@lib/prisma";
import { z } from "zod";

const GetUsers = z
  .function()
  .args(z.boolean().optional(), z.string().optional(), z.boolean().optional())
  .implement(async (full = false, role, status) => {
    return prisma.user
      .findMany({
        where: {
          active: status,
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
          active: true,
        },
      })
      .catch(() => []);
  });

export default GetUsers;
