import { ApiHandler } from "@lib/api/ApiHandler";
import { ExportTimeReport, FindTimeReportById } from "@lib/services/timeReport";
import { ReasonPhrases } from "http-status-codes";
import mine from "mime-types";
import { z } from "zod";

const QuerySchema = z.object({
  timeReportId: z.string(),
});

const handler = ApiHandler(async (req, res, { isAdmin }) => {
  const { timeReportId } = QuerySchema.parse(req.query);

  const document = await FindTimeReportById(timeReportId);

  if (!document) throw new Error(ReasonPhrases.NOT_FOUND);
  if (!document.validated) throw new Error(ReasonPhrases.FORBIDDEN);
  if (!isAdmin) throw new Error(ReasonPhrases.UNAUTHORIZED);

  switch (req.method) {
    case "GET": {
      const data = await ExportTimeReport(timeReportId);
      if (data) {
        const contentType = mine.lookup(".xlsx") || "text/plain";
        res.setHeader("Content-Type", contentType);
        res.setHeader(
          "Content-disposition",
          `attachment; filename=timereport-${document.id}.xlsx`
        );
        res.status(200).end(data);
      } else throw new Error(ReasonPhrases.BAD_REQUEST);
      break;
    }
    default: {
      throw new Error(ReasonPhrases.METHOD_NOT_ALLOWED);
    }
  }
});

export default handler;
