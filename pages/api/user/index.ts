import { CreateUser, GetUsers } from "@lib/services/user";
import { Role, ZodRoleEnum } from "@utils/user";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const QueryGetSchema = z.object({
  active: z.enum(["true", "false"]).optional(),
  complete: z.enum(["true"]).optional(),
  role: z.string().optional(),
});

const BodyPostSchema = z.object({
  username: z.string(),
  full_name: z.string(),
  role: ZodRoleEnum,
});

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  switch (method) {
    case "GET": {
      if (token && token.sub && token.role === Role.ADMIN) {
        const { active, role, complete } = QueryGetSchema.parse(req.query);
        const full = complete === "true";
        const status =
          typeof active === "undefined" ? undefined : active === "true";
        const data = await GetUsers(full, role, status);
        res.json(data);
      } else res.status(403).end("Forbidden");
      break;
    }
    case "POST": {
      const { full_name, role, username } = BodyPostSchema.parse(req.body);
      const user = await CreateUser(username, full_name, role);
      if (user) res.status(201).json(user);
      else res.status(400).end("Bad Request");
      break;
    }
    default: {
      res.status(400).end("Bad Request");
      break;
    }
  }
};

export default handler;
