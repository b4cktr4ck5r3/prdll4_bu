import { Close20 } from "@carbon/icons-react";
import { usePlannings } from "@hooks";
import { ActionIcon } from "@mantine/core";
import { WorkScheduleTask } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";
import { FC, useCallback, useMemo } from "react";
import { CardEventBase } from "./CardEventBase";

export type CardEventSimplifiedWSTProps = {
  timeReportId: string;
  workScheduleTask: WorkScheduleTask;
  buttonType?: "REPORT";
  buttonCallback?: () => void;
};

export const CardEventSimplifiedWST: FC<CardEventSimplifiedWSTProps> = ({
  timeReportId,
  workScheduleTask,
  buttonType,
  buttonCallback = () => null,
}) => {
  const { plannings } = usePlannings();
  const { name, startDate, endDate } = useMemo(
    () => workScheduleTask,
    [workScheduleTask]
  );

  const planningName = useMemo(
    () => plannings.find((e) => e.id === workScheduleTask.workScheduleId)?.name,
    [plannings, workScheduleTask.workScheduleId]
  );

  const dateString = useMemo(() => {
    return `${dayjs(startDate).toDate().toLocaleDateString("fr", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })}\n${dayjs(startDate).format("HH:mm")} - ${dayjs(endDate).format(
      "HH:mm"
    )}`;
  }, [startDate, endDate]);

  const deleteWorkScheduleTask = useCallback(() => {
    return axios
      .delete(
        `/api/timeReport/${timeReportId}/workScheduleTask/${workScheduleTask.id}`
      )
      .then(() => buttonCallback());
  }, [buttonCallback, timeReportId, workScheduleTask.id]);

  return (
    <CardEventBase>
      <div className="card-event-date">{dateString}</div>
      <div className="card-event-title">{name}</div>
      {planningName && (
        <div className="card-event-description">Planning : {planningName}</div>
      )}
      <div className="right-button">
        {buttonType === "REPORT" && (
          <ActionIcon
            color="red"
            variant="default"
            onClick={deleteWorkScheduleTask}
          >
            <Close20 color="red" />
          </ActionIcon>
        )}
      </div>
    </CardEventBase>
  );
};
