import { TimeReportBoxSC } from "@components/atoms";
import { CreateTimeReport } from "@components/organisms/CreateTimeReport";
import useUsersInfo from "@hooks/useUsersInfo";
import { Select } from "@mantine/core";
import { styled } from "@stitches";
import { FC, useEffect, useState } from "react";
import { DetailTimeReport, PreviousUserTimeReport } from "./widgets";

export const ManageTimeReportSC = styled("div", {
  maxWidth: "$640",
  "& > * + *": {
    marginTop: "$8",
  },
});

export const ManageTimeReport: FC = () => {
  const { users } = useUsersInfo();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedTimeReport, setSelectedTimeReport] = useState<string | null>(
    null
  );

  useEffect(() => {
    setSelectedTimeReport(null);
  }, [selectedUser]);

  return (
    <TimeReportBoxSC>
      <ManageTimeReportSC>
        <Select
          label="Choix de l'utilisateur"
          data={users.map((user) => ({
            value: user.id,
            label: user.full_name,
          }))}
          value={selectedUser}
          searchable
          clearable
          maxDropdownHeight={400}
          onChange={(value) => setSelectedUser(value)}
        />
        {selectedUser && (
          <>
            <CreateTimeReport
              userId={selectedUser}
              onNew={(value) => setSelectedTimeReport(value)}
            />
            <PreviousUserTimeReport
              userId={selectedUser}
              setSelectedTimeReport={setSelectedTimeReport}
            />
            <DetailTimeReport
              userId={selectedUser}
              timeReportId={selectedTimeReport}
              onClose={() => setSelectedTimeReport(null)}
            />
          </>
        )}
      </ManageTimeReportSC>
    </TimeReportBoxSC>
  );
};
