import { ApiHandler } from "@lib/api/ApiHandler";
import {
  CreateWorkScheduleTaskName,
  FindWorkScheduleTaskNames,
} from "@lib/services/workScheduleTaskName";
import { ZodWorkScheduleTaskNameItemForm } from "@utils/workScheduleTaskName";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const BodyPostSchema = ZodWorkScheduleTaskNameItemForm;

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  switch (req.method) {
    case "GET": {
      const data = await FindWorkScheduleTaskNames({});
      res.json(data);
      break;
    }
    case "POST": {
      if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);
      const { name } = BodyPostSchema.parse(req.body);
      const done = await CreateWorkScheduleTaskName(name);
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
