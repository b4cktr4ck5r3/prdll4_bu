import { ApiHandler } from "@lib/api/ApiHandler";
import {
  CreateInternalWork,
  FindInternalWork,
} from "@lib/services/internalWork";
import { ZodInternalWorkItemForm } from "@utils/internalWork";
import { ZodQueryBoolean, ZodQueryDate, ZodQueryString } from "@utils/zod";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QueryGetSchema = z.object({
  userId: ZodQueryString,
  startDate: ZodQueryDate,
  endDate: ZodQueryDate,
  validated: ZodQueryBoolean,
  withoutStatus: ZodQueryBoolean,
});

const BodyPostSchema = z.array(ZodInternalWorkItemForm);

const handler = ApiHandler(async (req, res, { userId }) => {
  switch (req.method) {
    case "GET": {
      const { userId, startDate, endDate, validated, withoutStatus } =
        QueryGetSchema.parse(req.query);
      const data = await FindInternalWork({
        userId,
        startDate,
        endDate,
        validated,
        withoutStatus,
      });
      res.json(data);
      break;
    }
    case "POST": {
      const listInternalWork = BodyPostSchema.parse(req.body);
      const done = await Promise.all(
        listInternalWork.map(({ date, description, duration }) =>
          CreateInternalWork(userId, date, duration, description)
        )
      ).then((values) => values.every(Boolean));
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
