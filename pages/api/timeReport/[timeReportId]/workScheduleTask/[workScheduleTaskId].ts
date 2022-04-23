import { ApiHandler } from "@lib/api/ApiHandler";
import {
  DeleteTimeReportItem,
  FindTimeReportById,
} from "@lib/services/timeReport";
import { FindWorkScheduleTaskById } from "@lib/services/workScheduleTask";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  workScheduleTaskId: z.string(),
  timeReportId: z.string(),
});

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  const { timeReportId, workScheduleTaskId } = QuerySchema.parse(req.query);

  const timeReport = await FindTimeReportById(timeReportId);
  const workScheduleTask = await FindWorkScheduleTaskById(workScheduleTaskId);

  if (!timeReport || !workScheduleTask)
    throw new Error(ReasonPhrases.NOT_FOUND);
  if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "DELETE": {
      const done = await DeleteTimeReportItem(
        timeReportId,
        "WST",
        workScheduleTaskId
      );
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
