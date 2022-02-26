import {
  CreateInternalWork,
  DeleteInternalWork,
  FindInternalWork,
  UpdateInternalWork,
} from "@lib/services/internalWork";
import { ZodInternalWorkItemForm } from "@utils/internalWork";
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
  ZodInternalWorkItemForm
);
const BodyPutSchema = ZodInternalWorkItemForm


const QueryIdSchema = z.object({
  id: z.string(),
});

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
    case "PUT": {
      if (userId) {
        const { id } = QueryIdSchema.parse(req.query);
        const updateData = BodyPutSchema.parse(req.body);
        console.log(updateData);
        const done = await UpdateInternalWork(id, updateData);
        res.json({
          result: done,
        });
        break;
      }
    }

    case "DELETE": {
      if (userId) {
        const { id: internalWorkId } = QueryIdSchema.parse(req.query);
        const done = await DeleteInternalWork(internalWorkId);
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
