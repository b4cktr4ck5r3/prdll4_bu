import { WorkScheduleTaskFull } from "@utils/workScheduleTask";
import dayjs from "dayjs";
import { FC, useMemo } from "react";
import { CardEventBase } from "./CardEventBase";

export type CardEventWorkScheduleTaskProps = {
  workScheduleTask: WorkScheduleTaskFull;
};

export const CardEventWorkScheduleTask: FC<CardEventWorkScheduleTaskProps> = ({
  workScheduleTask,
}) => {
  const { name, startDate, endDate, users } = useMemo(
    () => workScheduleTask,
    [workScheduleTask]
  );

  const dateString = useMemo(() => {
    return `${new Date(startDate).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}\n${dayjs(startDate).format("HH:mm")} à ${dayjs(endDate).format(
      "HH:mm"
    )}`;
  }, [startDate, endDate]);

  const usersString = useMemo(() => {
    return `${users.map((user) => "@" + user.full_name).join("\n")}`;
  }, [users]);

  return (
    <CardEventBase>
      <div className="card-event-title">{name}</div>
      <div className="card-event-date">{dateString}</div>
      <div className="card-event-text">{usersString}</div>
    </CardEventBase>
  );
};
