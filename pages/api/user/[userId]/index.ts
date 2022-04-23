import { ApiHandler } from "@lib/api/ApiHandler";
import { FindUserById } from "@lib/services/user/FindUserById";
import { ReasonPhrases } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  userId: z.string(),
});

const handler = ApiHandler(async (req, res, { isAdmin, userId: reqUserId }) => {
  const { userId } = QuerySchema.parse(req.query);

  const document = await FindUserById(userId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!(isAdmin || document.id === reqUserId))
    throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "GET": {
      res.json(document);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.BAD_REQUEST);
    }
  }
});

export default handler;
