import { prisma } from "@lib/prisma";
import { z } from "zod";

export const FindWorkSchedules = z.function().implement(async () => {
  return prisma.workSchedule.findMany().catch(() => []);
});
