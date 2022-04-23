import { FindInternalWork } from "@lib/services/internalWork";
import { NextApiHandler } from "next";
import { z } from "zod";

const QueryGetSchema = z.object({
  userId: z.string().min(1),
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

const handler: NextApiHandler = async (req, res) => {
  const { method, query } = req;

  const { userId } = QueryGetSchema.parse(query);

  switch (method) {
    case "GET": {
      if (userId) {
        const { startDate, endDate, validated } = QueryGetSchema.parse(
          req.query
        );
        const data = await FindInternalWork({
          userId,
          startDate,
          endDate,
          validated,
        });
        res.json(data);
        break;
      }
      break;
    }
    default: {
      res.status(400).end("Bad Request");
    }
  }
};

export default handler;
