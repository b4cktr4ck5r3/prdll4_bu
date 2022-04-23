import { ApiHandler } from "@lib/api/ApiHandler";
import { CreateTimeReport, FindTimeReport } from "@lib/services/timeReport";
import { ZodTimeReportItemForm } from "@utils/timeReport";
import { ReasonPhrases } from "http-status-codes";
import { z } from "zod";

const QueryGetSchema = z.object({
  userId: z.string().optional(),
  startDate: z
    .string()
    .optional()
    .transform((value) => {
      if (value && value !== "") return new Date(value);
      else return undefined;
    }),
  endDate: z
    .string()
    .optional()
    .transform((value) => {
      if (value && value !== "") return new Date(value);
      else return undefined;
    }),
  validated: z
    .string()
    .optional()
    .transform((value) => {
      if (value === "true") return true;
      else if (value === "false") return false;
      else return undefined;
    }),
});

const BodyPostSchema = ZodTimeReportItemForm;

const handler = ApiHandler(async (req, res) => {
  switch (req.method) {
    case "GET": {
      const { userId, startDate, endDate, validated } = QueryGetSchema.parse(
        req.query
      );
      const data = await FindTimeReport({
        userId,
        startDate,
        endDate,
        validated,
      });
      res.json(data);
      break;
    }
    case "POST": {
      const { userId, startDate, endDate } = BodyPostSchema.parse(req.body);
      const timeReportId = CreateTimeReport(userId, startDate, endDate);
      res.json({
        id: timeReportId,
      });
      break;
    }
    default: {
      throw new Error(ReasonPhrases.METHOD_NOT_ALLOWED);
    }
  }
});

export default handler;
