import { ApiHandler } from "@lib/api/ApiHandler";
import {
  DeleteTimeReportItem,
  FindTimeReportById,
} from "@lib/services/timeReport";
import { FindWorkScheduleTaskById } from "@lib/services/workScheduleTask";
import { ReasonPhrases } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  internalWorkId: z.string(),
  timeReportId: z.string(),
});

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  const { timeReportId, internalWorkId } = QuerySchema.parse(req.query);

  const timeReport = await FindTimeReportById(timeReportId);
  const internalWork = await FindWorkScheduleTaskById(internalWorkId);

  if (!timeReport || !internalWork) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "DELETE": {
      const done = await DeleteTimeReportItem(
        timeReportId,
        "IW",
        internalWorkId
      );
      if (done) res.status(200).end();
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.BAD_REQUEST);
    }
  }
});

export default handler;
