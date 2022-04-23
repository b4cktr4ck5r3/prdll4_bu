import { CardEventTimeReport } from "@components/molecules/CardEvent/CardEventTimeReport";
import { useTimeReports } from "@hooks";
import { Group, Text } from "@mantine/core";
import { styled } from "@stitches";
import { FC } from "react";

export const PreviousUserTimeReportSC = styled("div", {
  marginTop: "$12",
  ".time-report-card": {
    border: "1px solid $neutral3",
    borderRadius: "6px",
    padding: "6px 48px 6px 12px",
  },
});

export type PreviousUserTimeReportProps = {
  userId: string;
  setSelectedTimeReport: (value: string) => void;
};

export const PreviousUserTimeReport: FC<PreviousUserTimeReportProps> = ({
  userId,
  setSelectedTimeReport,
}) => {
  const { timeReports } = useTimeReports({ userId });

  return (
    <PreviousUserTimeReportSC>
      <h2 className="title center">Etats horaires précédents</h2>
      <Group direction="column" align={"stretch"}>
        {timeReports.length === 0 && (
          <Text align="center">
            {"Aucun état horaire trouvé pour l'utilisateur"}
          </Text>
        )}
        {timeReports.map((timeReport) => {
          return (
            <CardEventTimeReport
              timeReport={timeReport}
              key={timeReport.id}
              buttonType={"OPEN"}
              buttonCallback={() => setSelectedTimeReport(timeReport.id)}
            />
          );
        })}
      </Group>
    </PreviousUserTimeReportSC>
  );
};
