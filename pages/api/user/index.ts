import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  res.json({
    result: new Date().toISOString(),
  });
};

export default handler;
