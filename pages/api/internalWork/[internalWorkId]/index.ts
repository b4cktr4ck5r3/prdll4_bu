import { ApiHandler } from "@lib/api/ApiHandler";
import {
  DeleteInternalWork,
  FindInternalWorkById,
  UpdateInternalWork,
} from "@lib/services/internalWork";
import { ZodInternalWorkItemForm } from "@utils/internalWork";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  internalWorkId: z.string().min(1),
});

const BodyPutSchema = ZodInternalWorkItemForm.partial();

const handler = ApiHandler(async (req, res, { userId, isAdmin }) => {
  const { internalWorkId } = QuerySchema.parse(req.query);

  const document = await FindInternalWorkById(internalWorkId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!(isAdmin || document.user.id === userId))
    throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "PUT": {
      const updateData = BodyPutSchema.parse(req.body);
      const done = await UpdateInternalWork(internalWorkId, updateData);
      if (done) res.status(StatusCodes.NO_CONTENT).end();
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    case "DELETE": {
      if (document.status) throw new Error(ReasonPhrases.FORBIDDEN);
      const done = await DeleteInternalWork(internalWorkId);
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
