import { DeleteWorkScheduleTask } from "@lib/services/workScheduleTask";
import { Role } from "@utils/user";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const QuerySchema = z.object({
  taskId: z.string().min(1),
});

const handler: NextApiHandler = async (req, res) => {
  const { method, query } = req;
  const requestUser = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  const { taskId } = QuerySchema.parse(query);

  switch (method) {
    case "DELETE": {
      if (requestUser?.sub && requestUser?.role === Role.ADMIN) {
        const done = await DeleteWorkScheduleTask(taskId);
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
