import { prisma } from "@lib/prisma";
import { UpdateUserPassword } from "@lib/services/user";
import { compare } from "bcryptjs";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const BodyPutSchema = z.object({
  currentPassword: z.string(),
  newPassword: z
    .string()
    .min(6, { message: "Must be 6 or fewer characters long" }),
});

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const token = await getToken({
    req,
    encryption: true,
    signingKey: process.env.JWT_SIGNING_KEY,
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
    secret: process.env.JWT_SECRET,
  });

  const userId = token?.sub;

  switch (method) {
    case "PUT": {
      if (userId) {
        const { currentPassword, newPassword } = BodyPutSchema.parse(req.body);
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user) return res.json({ error: 404 });
        const allow = await compare(currentPassword, user.password);
        if (!allow) return res.json({ error: 401 });
        else {
          const done = await UpdateUserPassword(userId, newPassword);
          res.json({
            result: done,
          });
        }
        break;
      }
    }
    default: {
      res.json({
        result: new Date().toISOString(),
      });
    }
  }
};

export default handler;
