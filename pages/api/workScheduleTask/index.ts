import { ApiHandler } from "@lib/api/ApiHandler";
import {
  CreateWorkScheduleTask,
  FindWorkScheduleTask,
} from "@lib/services/workScheduleTask";
import { ZodWorkScheduleTaskItemForm } from "@utils/workScheduleTask";
import { ZodQueryBoolean, ZodQueryDate, ZodQueryString } from "@utils/zod";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QueryGetSchema = z.object({
  workScheduleId: ZodQueryString,
  acceptEqualDate: ZodQueryBoolean,
  startDate: ZodQueryDate,
  endDate: ZodQueryDate,
});

const BodyPostSchema = ZodWorkScheduleTaskItemForm;

const handler = ApiHandler(async (req, res) => {
  switch (req.method) {
    case "GET": {
      const { workScheduleId, endDate, startDate, acceptEqualDate } =
        QueryGetSchema.parse(req.query);
      const data = await FindWorkScheduleTask({
        workScheduleId,
        startDate,
        endDate,
        acceptEqualDate,
      });
      res.json(data);
      break;
    }
    case "POST": {
      const { workScheduleId, name, users, startDate, endDate } =
        BodyPostSchema.parse(req.body);
      const done = await CreateWorkScheduleTask(
        workScheduleId,
        name,
        users,
        startDate,
        endDate
      );
      if (done) res.status(StatusCodes.CREATED).end(ReasonPhrases.CREATED);
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.BAD_REQUEST);
    }
  }
});

export default handler;
