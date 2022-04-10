import { TimeReportBoxSC } from "@components/atoms";
import { CreateTimeReport } from "@components/organisms/CreateTimeReport";
import useUsersInfo from "@hooks/useUsersInfo";
import { Select } from "@mantine/core";
import { styled } from "@stitches";
import { FC, useState } from "react";

export const ManageTimeReportSC = styled("div", {
  maxWidth: "$640",
  "& > * + *": {
    marginTop: "$8",
  },
});

export const ManageTimeReport: FC = () => {
  const { users } = useUsersInfo();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

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
            <CreateTimeReport userId={selectedUser} />
            <h2>Etats horaires précédents</h2>
          </>
        )}
      </ManageTimeReportSC>
    </TimeReportBoxSC>
  );
};
