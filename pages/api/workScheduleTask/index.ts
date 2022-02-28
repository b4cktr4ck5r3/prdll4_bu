import {
  CreateWorkScheduleTask,
  FindWorkScheduleTask,
} from "@lib/services/workScheduleTask";
import { ZodWorkScheduleTaskItemForm } from "@utils/workScheduleTask";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const QueryGetSchema = z.object({
  workScheduleId: z.string().optional(),
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

const BodyPostSchema = ZodWorkScheduleTaskItemForm;

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
        const { workScheduleId, endDate, startDate } = QueryGetSchema.parse(
          req.query
        );
        const data = await FindWorkScheduleTask(
          workScheduleId,
          startDate,
          endDate
        );
        res.json(data);
        break;
      }
    }
    case "POST": {
      if (userId) {
        const { workScheduleId, name, users, startDate, endDate } =
          BodyPostSchema.parse(req.body);
        const done = await CreateWorkScheduleTask(
          workScheduleId,
          name,
          users,
          startDate,
          endDate
        );
        res.json({
          result: done,
        });
        break;
      }
    }
    default: {
      res.status(400).end("Bad Request");
    }
  }
};

export default handler;
