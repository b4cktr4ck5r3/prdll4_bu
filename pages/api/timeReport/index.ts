import { CreateTimeReport, FindTimeReport } from "@lib/services/timeReport";
import { ZodInternalWorkItemForm } from "@utils/internalWork";
import { ZodTimeReportItemForm } from "@utils/timeReport";
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
  validated: z
    .string()
    .optional()
    .transform((value) => {
      if (value === "true") return true;
      else if (value === "false") return false;
      else return undefined;
    }),
});

const BodyPostSchema = ZodTimeReportItemForm;
const BodyPutSchema = ZodInternalWorkItemForm.partial();

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
        const { startDate, endDate, validated } = QueryGetSchema.parse(
          req.query
        );
        const data = await FindTimeReport(
          userId,
          startDate,
          endDate,
          validated
        );
        res.json(data);
        break;
      }
    }
    case "POST": {
      if (userId) {
        const { userId, startDate, endDate } = BodyPostSchema.parse(req.body);
        const timeReportId = CreateTimeReport(userId, startDate, endDate);
        res.json({
          id: timeReportId,
        });
        break;
      }
    }
    // case "PUT": {
    //   if (userId) {
    //     const { id } = QueryIdSchema.parse(req.query);
    //     const updateData = BodyPutSchema.parse(req.body);
    //     const done = await UpdateInternalWork(id, updateData);
    //     res.json({
    //       result: done,
    //     });
    //     break;
    //   }
    // }

    // case "DELETE": {
    //   if (userId) {
    //     const { id: internalWorkId } = QueryIdSchema.parse(req.query);
    //     const done = await DeleteInternalWork(internalWorkId);
    //     res.json({
    //       result: done,
    //     });
    //     break;
    //   }
    // }
    default: {
      res.json({
        result: new Date().toISOString(),
      });
    }
  }
};

export default handler;
