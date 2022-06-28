import { prisma } from "@lib/prisma";
import { FormatHourRange } from "@utils/calendar/FormatHourRange";
import dayjs from "dayjs";
import { ReasonPhrases } from "http-status-codes";
import XLSX from "xlsx";
import { z } from "zod";

export const ExportTimeReport = z
  .function()
  .args(z.string())
  .implement(async (timeReportId) => {
    const document = await prisma.timeReport.findUnique({
      where: { id: timeReportId },
      include: {
        internalWorks: true,
        workScheduleTasks: {
          include: {
            schedule: true,
          },
        },
        user: true,
      },
    });

    if (!document) throw new Error(ReasonPhrases.NOT_FOUND);

    const workbook = XLSX.utils.book_new();

    const rowInternalWorks = document.internalWorks.map((iw) => [
      iw.date.toLocaleDateString("fr-FR"),
      "Travail Interne",
      iw.duration,
      document.startDate.getTime() - iw.date.getTime() > 0 ? "OUI" : "NON",
    ]);

    const rowWorkScheduleTasks = document.workScheduleTasks.map((task) => [
      `${task.startDate.toLocaleDateString("fr-FR")} | ${FormatHourRange(
        task.startDate,
        task.endDate
      )}`,
      `${task.name} - [${task.schedule.name}]`,
      Math.abs(dayjs(task.startDate).diff(dayjs(task.endDate), "h", true)),
      document.startDate.getTime() - task.startDate.getTime() > 0
        ? "OUI"
        : "NON",
    ]);

    const data: unknown[][] = [
      ["État horaire"],
      ["Date début", document.startDate.toLocaleDateString("fr-FR")],
      ["Date fin", document.endDate.toLocaleDateString("fr-FR")],
      ["ID Utilisateur", document.user.id],
      ["Nom Complet", document.user.full_name],
      [],
      ["Date", "Nom", "Valeur (en heures)", "Rattrapage"],
      ...rowInternalWorks,
      ...rowWorkScheduleTasks,
    ];

    data.push([]);
    const startIW = 8;
    const endIW = startIW + document.internalWorks.length - 1;
    if (document.internalWorks.length > 0)
      data.push([
        "Nombre d'heures des travaux internes",
        { f: `SUM(C${startIW}:C${endIW})` },
      ]);
    else data.push(["Total d'heures des travaux internes", 0]);

    const startTask = startIW + document.internalWorks.length;
    const endTask = startTask + document.workScheduleTasks.length - 1;
    if (document.workScheduleTasks.length > 0)
      data.push([
        "Total d'heures des séances",
        { f: `SUM(C${startTask}:C${endTask})` },
      ]);
    else data.push(["Nombre d'heures des séances", 0]);

    const lastLine = data.length + 1;
    data.push([
      "Total des heures à déclarer",
      {
        f: `B${lastLine - 2} + B${lastLine - 1} + ((B${lastLine - 2} + B${
          lastLine - 1
        }) / 5)`,
      },
    ]);

    const sheet = XLSX.utils.aoa_to_sheet(data);

    if (!sheet["!cols"]) sheet["!cols"] = [];
    sheet["!cols"][0] = { wch: 35 };
    sheet["!cols"][1] = { wch: 30 };
    sheet["!cols"][2] = { wch: 30 };
    sheet["!cols"][3] = { wch: 30 };

    XLSX.utils.book_append_sheet(workbook, sheet);

    return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  });
