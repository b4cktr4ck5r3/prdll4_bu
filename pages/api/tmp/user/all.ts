import { prisma } from "@lib/prisma";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const users = await prisma.user.findMany();

  res.json(
    users.map((user) => ({
      fullname: user.full_name,
      username: user.username,
      role: user.role,
    }))
  );
};

export default handler;
