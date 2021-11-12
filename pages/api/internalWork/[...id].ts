import { generate } from "generate-password";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  res.json(
    generate({ length: 8, numbers: true, uppercase: true, lowercase: false })
  );
};

export default handler;
