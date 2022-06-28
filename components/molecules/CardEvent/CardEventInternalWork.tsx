import { Close20 } from "@carbon/icons-react";
import { ActionIcon } from "@mantine/core";
import { InternalWork } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";
import { FC, useCallback, useMemo } from "react";
import { CardEventBase } from "./CardEventBase";

export type CardEventInternalWorkProps = {
  timeReportId: string;
  internalWork: InternalWork;
  buttonType?: "REPORT";
  buttonCallback?: () => void;
};

export const CardEventInternalWork: FC<CardEventInternalWorkProps> = ({
  timeReportId,
  internalWork,
  buttonType,
  buttonCallback = () => null,
}) => {
  const { date, duration, description } = useMemo(
    () => internalWork,
    [internalWork]
  );

  const dateString = useMemo(() => {
    return `${dayjs(date).toDate().toLocaleDateString("fr", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })}`;
  }, [date]);

  const reportInternalWork = useCallback(() => {
    return axios
      .delete(`/api/timeReport/${timeReportId}/internalWork/${internalWork.id}`)
      .then(() => buttonCallback());
  }, [buttonCallback, internalWork.id, timeReportId]);

  return (
    <CardEventBase>
      <div className="card-event-date">{dateString}</div>
      <div className="card-event-title">Durée : {duration.toFixed(2)}h</div>
      {description && <div>Description : {description}</div>}
      <div className="right-button">
        {buttonType === "REPORT" && (
          <ActionIcon
            color="red"
            variant="default"
            onClick={reportInternalWork}
          >
            <Close20 color="red" />
          </ActionIcon>
        )}
      </div>
    </CardEventBase>
  );
};
