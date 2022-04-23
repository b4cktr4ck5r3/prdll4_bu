import { ApiHandler } from "@lib/api/ApiHandler";
import { UpdateUserRole } from "@lib/services/user";
import { FindUserById } from "@lib/services/user/FindUserById";
import { Role } from "@utils/user";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  userId: z.string(),
});

const handler = ApiHandler(async (req, res, { isAdmin, userId: reqUserId }) => {
  const { userId } = QuerySchema.parse(req.query);

  const document = await FindUserById(userId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "POST": {
      if (userId === reqUserId) throw new Error(ReasonPhrases.FORBIDDEN);
      const done = await UpdateUserRole(userId, Role.ADMIN);
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
