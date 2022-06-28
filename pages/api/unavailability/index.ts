import { ApiHandler } from "@lib/api/ApiHandler";
import {
  CreateUnavailability,
  FindUnavailability,
} from "@lib/services/unavailability";
import { ZodQueryBoolean, ZodQueryDate, ZodQueryString } from "@utils/zod";
import dayjs from "dayjs";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QueryGetSchema = z.object({
  userId: ZodQueryString,
  acceptEqualDate: ZodQueryBoolean,
  startDate: ZodQueryDate,
  endDate: ZodQueryDate,
});

const BodyPostSchema = z.array(
  z.object({
    startDate: z.string().transform((value) => dayjs(value).toDate()),
    endDate: z.string().transform((value) => dayjs(value).toDate()),
  })
);

const handler = ApiHandler(async (req, res, { userId }) => {
  switch (req.method) {
    case "GET": {
      const { userId, startDate, endDate, acceptEqualDate } =
        QueryGetSchema.parse(req.query);
      const data = await FindUnavailability({
        userId,
        startDate,
        endDate,
        acceptEqualDate,
      });
      res.json(data);
      break;
    }
    case "POST": {
      const listUnavailability = BodyPostSchema.parse(req.body);
      const done = await Promise.all(
        listUnavailability.map(({ startDate, endDate }) =>
          CreateUnavailability(userId, startDate, endDate)
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
