import { CreateUser } from "@lib/services/user";
import { Role } from "@utils/user";
import { NextApiHandler } from "next";
import { z } from "zod";

const BodyPostSchema = z.object({
  username: z.string(),
  fullname: z.string(),
  role: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  const { fullname, role, username } = BodyPostSchema.parse(req.body);
  const result = await CreateUser(username, fullname, role as Role);

  res.json(result);
};

export default handler;
