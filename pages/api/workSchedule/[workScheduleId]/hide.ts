import { ApiHandler } from "@lib/api/ApiHandler";
import {
  FindWorkScheduleById,
  HideWorkSchedule,
} from "@lib/services/workSchedule";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  workScheduleId: z.string(),
});

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  const { workScheduleId } = QuerySchema.parse(req.query);

  const document = await FindWorkScheduleById(workScheduleId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "POST": {
      if (document.hidden) throw new Error(ReasonPhrases.FORBIDDEN);
      const done = await HideWorkSchedule(workScheduleId);
      if (done)
        res.status(StatusCodes.NO_CONTENT).end(ReasonPhrases.NO_CONTENT);
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.METHOD_NOT_ALLOWED);
    }
  }
});

export default handler;
