import { TrashCan20 } from "@carbon/icons-react";
import { ActionIcon } from "@mantine/core";
import { WorkScheduleTaskFull } from "@utils/workScheduleTask";
import axios from "axios";
import dayjs from "dayjs";
import { FC, useCallback, useMemo } from "react";
import { CardEventBase } from "./CardEventBase";

export type CardEventWorkScheduleTaskProps = {
  workScheduleTask: WorkScheduleTaskFull;
  deletable?: boolean;
  onDelete?: () => void;
};

export const CardEventWorkScheduleTask: FC<CardEventWorkScheduleTaskProps> = ({
  workScheduleTask,
  deletable,
  onDelete = () => null,
}) => {
  const { name, startDate, endDate, users } = useMemo(
    () => workScheduleTask,
    [workScheduleTask]
  );

  const dateString = useMemo(() => {
    return `${new Date(startDate).toLocaleDateString("fr", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })}\n${dayjs(startDate).format("HH:mm")} - ${dayjs(endDate).format(
      "HH:mm"
    )}`;
  }, [startDate, endDate]);

  const usersString = useMemo(() => {
    return `${users.map((user) => "@" + user.full_name).join("\n")}`;
  }, [users]);

  const deleteWorkScheduleTask = useCallback(() => {
    return axios
      .delete(`/api/workScheduleTask/${workScheduleTask.id}`)
      .then(() => onDelete());
  }, [onDelete, workScheduleTask.id]);

  return (
    <CardEventBase>
      <div className="card-event-date">{dateString}</div>
      <div className="card-event-title">{name}</div>
      <div className="card-event-text">{usersString}</div>
      <div className="right-button">
        {deletable && (
          <ActionIcon
            color="red"
            variant="default"
            onClick={deleteWorkScheduleTask}
          >
            <TrashCan20 color="red" />
          </ActionIcon>
        )}
      </div>
    </CardEventBase>
  );
};
