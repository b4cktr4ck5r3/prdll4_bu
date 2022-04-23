import { ApiHandler } from "@lib/api/ApiHandler";
import {
  CreateUnavailability,
  FindUnavailability,
} from "@lib/services/unavailability";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QueryGetSchema = z.object({
  acceptEqualDate: z
    .string()
    .optional()
    .transform((value) => {
      if (value === "true") return true;
      else if (value === "false") return false;
      else return undefined;
    }),
  startDate: z
    .string()
    .optional()
    .transform((value) => {
      if (value && value !== "") return new Date(value);
      else return undefined;
    }),
  endDate: z
    .string()
    .optional()
    .transform((value) => {
      if (value && value !== "") return new Date(value);
      else return undefined;
    }),
});

const BodyPostSchema = z.array(
  z.object({
    startDate: z.string().transform((value) => new Date(value)),
    endDate: z.string().transform((value) => new Date(value)),
  })
);

const handler = ApiHandler(async (req, res, { userId }) => {
  switch (req.method) {
    case "GET": {
      const { startDate, endDate, acceptEqualDate } = QueryGetSchema.parse(
        req.query
      );
      const data = await FindUnavailability({
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
