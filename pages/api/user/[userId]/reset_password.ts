import { ApiHandler } from "@lib/api/ApiHandler";
import { ResetUserPassword } from "@lib/services/user";
import { FindUserById } from "@lib/services/user/FindUserById";
import { ReasonPhrases } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  userId: z.string(),
});

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  const { userId } = QuerySchema.parse(req.query);

  const document = await FindUserById(userId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "POST": {
      const resetInfo = await ResetUserPassword(userId);
      if (resetInfo) res.json(resetInfo);
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.METHOD_NOT_ALLOWED);
    }
  }
});

export default handler;
