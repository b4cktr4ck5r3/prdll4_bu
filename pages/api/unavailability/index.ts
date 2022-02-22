import {
  CreateUnavailability,
  DeleteUnavailability,
  FindUnavailability,
} from "@lib/services/unavailability";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const QueryGetSchema = z.object({
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

const QueryDeleteSchema = z.string();

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  const userId = token?.sub;

  switch (method) {
    case "GET": {
      if (userId) {
        const { startDate, endDate } = QueryGetSchema.parse(req.query);
        const data = await FindUnavailability(userId, startDate, endDate);
        res.json(data);
        break;
      }
    }
    case "POST": {
      if (userId) {
        const listUnavailability = BodyPostSchema.parse(req.body);
        const done = await Promise.all(
          listUnavailability.map(({ startDate, endDate }) =>
            CreateUnavailability(userId, startDate, endDate)
          )
        ).then((values) => values.every(Boolean));
        res.json({
          result: done,
        });
        break;
      }
    }

    case "DELETE":{
      if(userId) {
        const unavailabilityId = QueryDeleteSchema.parse(req.query.id);
        const done = await DeleteUnavailability(unavailabilityId);
        res.json({
          result: done,
        });
        break;
      }
    }

    default: {
      res.json({
        result: new Date().toISOString(),
      });
    }
  }
};

export default handler;
