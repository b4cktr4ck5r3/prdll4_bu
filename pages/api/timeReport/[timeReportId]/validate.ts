import { ApiHandler } from "@lib/api/ApiHandler";
import {
  FindTimeReportById,
  ValidateTimeReport,
} from "@lib/services/timeReport";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  timeReportId: z.string(),
});

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  const { timeReportId } = QuerySchema.parse(req.query);

  const document = await FindTimeReportById(timeReportId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "POST": {
      const done = await ValidateTimeReport(timeReportId);
      if (done)
        res.status(StatusCodes.NO_CONTENT).end(ReasonPhrases.NO_CONTENT);
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.BAD_REQUEST);
    }
  }
});

export default handler;
