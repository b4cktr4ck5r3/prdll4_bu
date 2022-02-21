import { DeleteUser } from "@lib/services/user";
import { Role } from "@utils/user";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const QuerySchema = z.object({
  userId: z.string().min(1),
});

const handler: NextApiHandler = async (req, res) => {
  const { method, query } = req;
  const requestUser = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  const { userId } = QuerySchema.parse(query);

  switch (method) {
    case "DELETE": {
      if (
        requestUser?.sub &&
        requestUser?.role === Role.ADMIN &&
        requestUser?.sub !== userId
      ) {
        const done = await DeleteUser(userId);
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
