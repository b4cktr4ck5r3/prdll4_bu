import { DeleteTimeReportItem } from "@lib/services/timeReport";
import { Role } from "@utils/user";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const QuerySchema = z.object({
  workScheduleTaskId: z.string().min(1),
  timeReportId: z.string().min(1),
});

const handler: NextApiHandler = async (req, res) => {
  const { method, query } = req;
  const requestUser = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  const { workScheduleTaskId, timeReportId } = QuerySchema.parse(query);

  switch (method) {
    case "DELETE": {
      if (requestUser?.sub && requestUser?.role === Role.ADMIN) {
        const done = await DeleteTimeReportItem(
          timeReportId,
          "WST",
          workScheduleTaskId
        );
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
