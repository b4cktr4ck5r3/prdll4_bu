import dayjs from "dayjs";
import { z } from "zod";

export const ZodQueryString = z.string().optional();

export const ZodQueryBoolean = z
  .string()
  .optional()
  .transform((value) => {
    if (value === "true") return true;
    else if (value === "false") return false;
    else return undefined;
  });

export const ZodQueryDate = z
  .string()
  .optional()
  .transform((value) => {
    if (value && value !== "") return dayjs(value).toDate();
    else return undefined;
  });
