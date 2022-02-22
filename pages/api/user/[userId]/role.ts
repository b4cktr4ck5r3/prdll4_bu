import { UpdateUserRole } from "@lib/services/user";
import { Role, ZodRoleEnum } from "@utils/user";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const QuerySchema = z.object({
  userId: z.string().min(1),
});

const BodyPutUpdateSchema = z.object({
  role: ZodRoleEnum,
});

const handler: NextApiHandler = async (req, res) => {
  const { method, query } = req;
  const requestUser = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  const { userId } = QuerySchema.parse(query);

  switch (method) {
    case "PUT": {
      if (
        requestUser?.sub &&
        requestUser?.role === Role.ADMIN &&
        requestUser?.sub !== userId
      ) {
        const { role } = BodyPutUpdateSchema.parse(req.body);

        const done = await UpdateUserRole(userId, role);
        if (done) res.status(200).end();
        else res.status(400).end("Bad Request");
      } else res.status(400).end("Bad Request");
      break;
    }
    default: {
      res.status(400).end("Bad Request");
    }
  }
};

export default handler;
