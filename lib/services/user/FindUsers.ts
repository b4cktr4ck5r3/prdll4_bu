import { prisma } from "@lib/prisma";
import { SafeUserSelect } from "@utils/user";
import { z } from "zod";

export const FindUsers = z
  .function()
  .args(
    z.object({
      full: z.boolean().optional(),
      role: z.string().optional(),
      status: z.boolean().optional(),
    })
  )
  .implement(async ({ full = false, role, status }) => {
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
          ...SafeUserSelect,
        },
      })
      .catch(() => []);
  });
