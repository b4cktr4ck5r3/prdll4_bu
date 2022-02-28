import CreateWorkSchedule from "@lib/services/workSchedule/CreateWorkSchedule";
import GetWorkSchedules from "@lib/services/workSchedule/GetWorkSchedules";
import { ZodWorkScheduleItemForm } from "@utils/workSchedule";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";

const BodyPostSchema = ZodWorkScheduleItemForm;

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  const userId = token?.sub;

  switch (method) {
    case "GET": {
      if (userId) {
        const data = await GetWorkSchedules();
        res.json(data);
        break;
      }
    }
    case "POST": {
      if (userId) {
        const { name, startDate, endDate } = BodyPostSchema.parse(req.body);
        const done = await CreateWorkSchedule(name, startDate, endDate);
        res.json({
          result: done,
        });
        break;
      }
    }
    default: {
      res.status(400).end("Bad Request");
    }
  }
};

export default handler;
