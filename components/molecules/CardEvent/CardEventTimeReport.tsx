import { Maximize20 } from "@carbon/icons-react";
import { ActionIcon, Text } from "@mantine/core";
import { FormatDateText, TimeReportFull } from "@utils/timeReport";
import { FC, useMemo } from "react";
import { CardEventBase } from "./CardEventBase";

export type CardEventTimeReportProps = {
  timeReport: TimeReportFull;
  buttonType?: "OPEN";
  buttonCallback?: () => void;
};

export const CardEventTimeReport: FC<CardEventTimeReportProps> = ({
  timeReport,
  buttonType,
  buttonCallback = () => null,
}) => {
  const { startDate, endDate, validated } = useMemo(
    () => timeReport,
    [timeReport]
  );

  return (
    <CardEventBase>
      <div className="card-event-dates">
        <span>{FormatDateText(startDate)}</span> -{" "}
        <span>{FormatDateText(endDate)}</span>
      </div>
      <Text className="card-event-text" weight={"bold"}>
        Staut :{" "}
        <Text component="span" color={validated ? "green" : "orange"}>
          {validated ? "Validé" : "Non validé"}
        </Text>
      </Text>
      <div className="right-button">
        {buttonType === "OPEN" && (
          <ActionIcon color="blue" variant="default" onClick={buttonCallback}>
            <Maximize20 color="blue" />
          </ActionIcon>
        )}
      </div>
    </CardEventBase>
  );
};
