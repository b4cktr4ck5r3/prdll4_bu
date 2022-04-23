import { ApiHandler } from "@lib/api/ApiHandler";
import { CreateUser, FindUsers } from "@lib/services/user";
import { ZodRoleEnum } from "@utils/user";
import { ZodQueryBoolean, ZodQueryString } from "@utils/zod";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";

const QueryGetSchema = z.object({
  active: ZodQueryBoolean,
  complete: ZodQueryBoolean,
  role: ZodQueryString,
});

const BodyPostSchema = z.object({
  username: z.string(),
  full_name: z.string(),
  role: ZodRoleEnum,
});

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  switch (req.method) {
    case "GET": {
      const { active, role, complete } = QueryGetSchema.parse(req.query);
      const data = await FindUsers({ full: complete, role, status: active });
      res.json(data);
      break;
    }
    case "POST": {
      if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);
      const { full_name, role, username } = BodyPostSchema.parse(req.body);
      const user = await CreateUser(username, full_name, role);
      if (user) res.status(StatusCodes.CREATED).json(user);
      else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.BAD_REQUEST);
    }
  }
});

export default handler;
