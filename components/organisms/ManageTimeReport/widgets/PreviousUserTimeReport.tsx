import { CardEventTimeReport } from "@components/molecules/CardEvent/CardEventTimeReport";
import { useTimeReports } from "@hooks";
import { Group, Pagination, Text } from "@mantine/core";
import { styled } from "@stitches";
import { FC, useEffect, useMemo, useState } from "react";

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

const limit = 10;

export const PreviousUserTimeReport: FC<PreviousUserTimeReportProps> = ({
  userId,
  setSelectedTimeReport,
}) => {
  const { timeReports } = useTimeReports({ userId });
  const [page, setPage] = useState(0);

  const totalPage = useMemo(() => {
    return Math.max(Math.ceil(timeReports.length / limit), 1);
  }, [timeReports.length]);

  useEffect(() => {
    setPage(0);
  }, [timeReports]);

  return (
    <PreviousUserTimeReportSC>
      <h2 className="title center">Etats horaires précédents</h2>
      <Group direction="column" align={"stretch"}>
        {timeReports.length === 0 && (
          <Text align="center">
            {"Aucun état horaire trouvé pour l'utilisateur"}
          </Text>
        )}
        {timeReports
          .slice(page * limit, page * limit + limit)
          .map((timeReport) => {
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
      <Group position="center" mt="md">
        <Pagination
          page={page + 1}
          total={totalPage}
          onChange={(page) => setPage(page - 1)}
        />
      </Group>
    </PreviousUserTimeReportSC>
  );
};
