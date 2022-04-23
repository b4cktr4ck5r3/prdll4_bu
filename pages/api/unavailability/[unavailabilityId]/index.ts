import { ApiHandler } from "@lib/api/ApiHandler";
import {
  DeleteUnavailability,
  FindUnavailabilityById,
  UpdateUnavailability,
} from "@lib/services/unavailability";
import { ZodUnavailabilityItemForm } from "@utils/unavailability/unavailability";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const BodyPutSchema = ZodUnavailabilityItemForm;

const QuerySchema = z.object({
  unavailabilityId: z.string().min(1),
});

const handler = ApiHandler(async (req, res, { userId, isAdmin }) => {
  const { unavailabilityId } = QuerySchema.parse(req.query);

  const document = await FindUnavailabilityById(unavailabilityId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!(isAdmin || document.user.id === userId))
    throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "PUT": {
      const { unavailabilityId } = QuerySchema.parse(req.query);
      const updateData = BodyPutSchema.parse(req.body);
      const done = await UpdateUnavailability(unavailabilityId, updateData);
      if (done) res.status(StatusCodes.NO_CONTENT).end();
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    case "DELETE": {
      const { unavailabilityId } = QuerySchema.parse(req.query);
      const done = await DeleteUnavailability(unavailabilityId);
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
