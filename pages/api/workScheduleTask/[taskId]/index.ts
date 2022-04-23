import { ApiHandler } from "@lib/api/ApiHandler";
import {
  DeleteWorkScheduleTask,
  FindWorkScheduleTaskById,
} from "@lib/services/workScheduleTask";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  taskId: z.string(),
});

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  const { taskId } = QuerySchema.parse(req.query);

  const document = await FindWorkScheduleTaskById(taskId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "DELETE": {
      const done = await DeleteWorkScheduleTask(taskId);
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
