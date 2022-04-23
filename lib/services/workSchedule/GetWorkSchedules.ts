import { prisma } from "@lib/prisma";
import { z } from "zod";

export const GetWorkSchedules = z.function().implement(async () => {
  return prisma.workSchedule.findMany().catch(() => []);
});
