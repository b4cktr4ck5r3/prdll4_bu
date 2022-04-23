import { ApiHandler } from "@lib/api/ApiHandler";
import { UNSAFE_FindUserById, UpdateUserPassword } from "@lib/services/user";
import { compare } from "bcryptjs";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QuerySchema = z.object({
  userId: z.string(),
});

const BodyPostSchema = z.object({
  currentPassword: z.string(),
  newPassword: z
    .string()
    .min(6, { message: "Must be 6 or fewer characters long" }),
});

const handler = ApiHandler(async (req, res, { isAdmin, userId: reqUserId }) => {
  const { userId } = QuerySchema.parse(req.query);

  const document = await UNSAFE_FindUserById(userId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!(isAdmin || document.id === reqUserId))
    throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "POST": {
      const { currentPassword, newPassword } = BodyPostSchema.parse(req.body);
      const allow = await compare(currentPassword, document.password);
      if (!allow) throw new Error(ReasonPhrases.BAD_REQUEST);
      else {
        await UpdateUserPassword(userId, newPassword)
          .then(() => res.status(StatusCodes.NO_CONTENT).end())
          .catch(() => {
            throw new Error(ReasonPhrases.BAD_REQUEST);
          });
      }
      break;
    }
    default: {
      throw new Error(ReasonPhrases.METHOD_NOT_ALLOWED);
    }
  }
});

export default handler;
