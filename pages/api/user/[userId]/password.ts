import { prisma } from "@lib/prisma";
import { ResetUserPassword, UpdateUserPassword } from "@lib/services/user";
import { Role } from "@utils/user";
import { compare } from "bcryptjs";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const QuerySchema = z.object({
  userId: z.string().min(1),
});

const BodyPutUpdateSchema = z.object({
  currentPassword: z.string(),
  newPassword: z
    .string()
    .min(6, { message: "Must be 6 or fewer characters long" }),
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
        // Case reset password
        const resetInfo = await ResetUserPassword(userId);
        if (resetInfo) res.json(resetInfo);
        else res.status(400).end("Bad Request");
      } else if (requestUser?.sub === userId) {
        // Case update password
        const { currentPassword, newPassword } = BodyPutUpdateSchema.parse(
          req.body
        );
        const user = await prisma.user.findUnique({
          where: {
            id: requestUser?.sub,
          },
        });
        if (!user) return res.status(404).json({ error: 404 });
        const allow = await compare(currentPassword, user.password);
        if (!allow) return res.status(401).json({ error: 401 });
        else {
          await UpdateUserPassword(requestUser.sub, newPassword)
            .then(() => res.status(200).end())
            .catch(() => res.status(400).end("Bad Request"));
        }
      } else res.status(400).end("Bad Request");
      break;
    }
    default: {
      res.status(400).end("Bad Request");
    }
  }
};

export default handler;
