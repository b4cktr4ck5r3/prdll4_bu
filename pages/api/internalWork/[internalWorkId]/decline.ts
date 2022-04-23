import { ApiHandler } from "@lib/api/ApiHandler";
import {
  DeclineInternalWork,
  FindInternalWorkById,
} from "@lib/services/internalWork";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  internalWorkId: z.string().min(1),
});

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  const { internalWorkId } = QuerySchema.parse(req.query);

  const document = await FindInternalWorkById(internalWorkId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "POST": {
      if (document.status) throw new Error(ReasonPhrases.FORBIDDEN);
      const done = await DeclineInternalWork(internalWorkId);
      if (done) res.status(StatusCodes.NO_CONTENT).end();
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.METHOD_NOT_ALLOWED);
    }
  }
});

export default handler;
