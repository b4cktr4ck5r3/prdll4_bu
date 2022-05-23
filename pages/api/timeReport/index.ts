import { ApiHandler } from "@lib/api/ApiHandler";
import { CreateTimeReport, FindTimeReport } from "@lib/services/timeReport";
import { ZodTimeReportItemForm } from "@utils/timeReport";
import { ZodQueryBoolean, ZodQueryDate, ZodQueryString } from "@utils/zod";
import { ReasonPhrases } from "http-status-codes";
import { z } from "zod";

const QueryGetSchema = z.object({
  userId: ZodQueryString,
  startDate: ZodQueryDate,
  endDate: ZodQueryDate,
  validated: ZodQueryBoolean,
});

const BodyPostSchema = ZodTimeReportItemForm;

const handler = ApiHandler(async (req, res, { isAdmin }) => {
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
      if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);
      const { userId, startDate, endDate } = BodyPostSchema.parse(req.body);
      const timeReportId = await CreateTimeReport(userId, startDate, endDate);
      if (timeReportId)
        res.json({
          id: timeReportId,
        });
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.METHOD_NOT_ALLOWED);
    }
  }
});

export default handler;
