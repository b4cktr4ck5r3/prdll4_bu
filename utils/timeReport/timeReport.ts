import {
  InternalWork,
  TimeReport,
  TimeReportExtra,
  User,
  WorkScheduleTask,
} from "@prisma/client";
import dayjs from "dayjs";
import { z } from "zod";

export type TimeReportItemForm = {
  userId: string;
  startDate: Date;
  endDate: Date;
};

export const ZodTimeReportItemForm = z.object({
  userId: z.string(),
  startDate: z.date().or(z.string().transform((value) => new Date(value))),
  endDate: z.date().or(z.string().transform((value) => new Date(value))),
});

export type TimeReportFull = TimeReport & {
  user?: User;
  workScheduleTasks: WorkScheduleTask[];
  internalWorks: InternalWork[];
  extraItems: TimeReportExtra[];
};

export const CalculDeclaredHours = (
  internalWorks: InternalWork[],
  workScheduleTasks: WorkScheduleTask[],
  extraItems: TimeReportExtra[]
) => {
  const sumExtraItems = extraItems.reduce((acc, cur) => acc + cur.duration, 0);
  const sumInternalWorks = internalWorks.reduce(
    (acc, cur) => acc + cur.duration,
    0
  );
  const sumWorkScheduleTasks = workScheduleTasks.reduce(
    (acc, cur) =>
      acc + Math.abs(dayjs(cur.startDate).diff(dayjs(cur.endDate), "h")),
    0
  );

  // const sumHours = sumExtraItems + sumInternalWorks + sumWorkScheduleTasks;
  const sumHours = sumInternalWorks + sumWorkScheduleTasks;

  const declaredHours = sumHours + sumHours / 5;

  return {
    sumExtraItems,
    sumInternalWorks,
    sumWorkScheduleTasks,
    sumHours,
    declaredHours,
  };
};

export const FormatDateText = (date: Date | string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CompareDate = (date1: Date | string, date2: Date | string) => {
  return new Date(date1).getTime() - new Date(date2).getTime();
};

export const SplitTimeReport = (timeReport: TimeReportFull) => {
  const [previousWST, currentWST] = timeReport.workScheduleTasks.reduce<
    [WorkScheduleTask[], WorkScheduleTask[]]
  >(
    (acc, cur) => {
      if (CompareDate(timeReport.startDate, cur.startDate) > 0)
        acc[0].push(cur);
      else acc[1].push(cur);
      return acc;
    },
    [[], []]
  );

  const [previousIW, currentIW] = timeReport.internalWorks.reduce<
    [InternalWork[], InternalWork[]]
  >(
    (acc, cur) => {
      if (CompareDate(timeReport.startDate, cur.date) > 0) acc[0].push(cur);
      else acc[1].push(cur);
      return acc;
    },
    [[], []]
  );

  return {
    previousWST,
    currentWST,
    previousIW,
    currentIW,
    extraItems: timeReport.extraItems,
  };
};
