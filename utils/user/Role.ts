import { z } from "zod";

export const ZodRoleEnum = z.enum(["ADMIN", "USER"]);

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
