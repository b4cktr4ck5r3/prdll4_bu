import {
  CreateInternalWork,
  FindInternalWork,
} from "@lib/services/internalWork";
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
    date: z.string().transform((value) => new Date(value)),
    duration: z.number(),
    description: z.string(),
  })
);

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const token = await getToken({
    req,
    encryption: true,
    signingKey: process.env.JWT_SIGNING_KEY,
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
    secret: process.env.JWT_SECRET,
  });

  const userId = token?.sub;

  switch (method) {
    case "GET": {
      if (userId) {
        const { startDate, endDate } = QueryGetSchema.parse(req.query);
        const data = await FindInternalWork(userId, startDate, endDate);
        res.json(data);
        break;
      }
    }
    case "POST": {
      if (userId) {
        const listInternalWork = BodyPostSchema.parse(req.body);
        const done = await Promise.all(
          listInternalWork.map(({ date, description, duration }) =>
            CreateInternalWork(userId, date, duration, description)
          )
        ).then((values) => values.every(Boolean));
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
