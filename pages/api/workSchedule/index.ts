import { ApiHandler } from "@lib/api/ApiHandler";
import {
  CreateWorkSchedule,
  FindWorkSchedules,
} from "@lib/services/workSchedule";
import { ZodWorkScheduleItemForm } from "@utils/workSchedule";
import { ZodQueryBoolean } from "@utils/zod";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QueryGetSchema = z.object({
  hidden: ZodQueryBoolean,
});

const BodyPostSchema = ZodWorkScheduleItemForm;

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  switch (req.method) {
    case "GET": {
      const { hidden } = QueryGetSchema.parse(req.query);
      const data = await FindWorkSchedules({ hidden });
      res.json(data);
      break;
    }
    case "POST": {
      if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);
      const { name, startDate, endDate } = BodyPostSchema.parse(req.body);
      const done = await CreateWorkSchedule(name, startDate, endDate);
      if (done) res.status(StatusCodes.CREATED).end(ReasonPhrases.CREATED);
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.METHOD_NOT_ALLOWED);
    }
  }
});

export default handler;
