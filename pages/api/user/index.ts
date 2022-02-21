import { GetUsers } from "@lib/services/user";
import { Role } from "@utils/user";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const QueryGetSchema = z.object({
  role: z.string().optional(),
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
        break;
      } else res.status(403).end("Forbidden");
    }
    default: {
      res.status(400).end("Bad Request");
    }
  }
};

export default handler;
