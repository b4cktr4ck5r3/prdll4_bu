import { CreateUser, GetUsers } from "@lib/services/user";
import { Role, ZodRoleEnum } from "@utils/user";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const QueryGetSchema = z.object({
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
        const { role } = QueryGetSchema.parse(req.query);
        const data = await GetUsers(role);
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
