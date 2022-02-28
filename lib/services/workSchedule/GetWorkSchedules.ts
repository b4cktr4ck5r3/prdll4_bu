import { prisma } from "@lib/prisma";
import { z } from "zod";

const GetWorkSchedules = z.function().implement(async () => {
  return prisma.workSchedule.findMany().catch(() => []);
});

export default GetWorkSchedules;
