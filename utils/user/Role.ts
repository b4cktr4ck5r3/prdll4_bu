import { z } from "zod";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export const ZodRoleEnum = z.enum([Role.ADMIN, Role.USER]);
