import { ApiHandler } from "@lib/api/ApiHandler";
import { DeleteWorkScheduleTaskName } from "@lib/services/workScheduleTaskName";
import { FindWorkScheduleTaskNameById } from "@lib/services/workScheduleTaskName/FindWorkScheduleTaskNameById";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  workScheduleTaskNameId: z.string(),
});

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  const { workScheduleTaskNameId } = QuerySchema.parse(req.query);

  const document = await FindWorkScheduleTaskNameById(workScheduleTaskNameId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "DELETE": {
      const done = await DeleteWorkScheduleTaskName(workScheduleTaskNameId);
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
