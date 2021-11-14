import { prisma } from "@lib/prisma";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";

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
    case "GET": {
      if (userId) {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        res.json({
          role: user?.role,
        });
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
