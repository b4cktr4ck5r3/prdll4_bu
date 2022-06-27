import { BoxSC } from "@components/atoms";
import { ManageInternalWorkList } from "@components/organisms/ManageInternalWork/widgets/ManageInternalWorkList";
import { useInternalWorks, useUsersInfo } from "@hooks";
import { Group, Select } from "@mantine/core";
import { styled } from "@stitches/react";
import type { FC } from "react";
import { useCallback, useState } from "react";

export const ManageInternalWorkSC = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  gap: "$24",
  ".row": {
    flex: "0 0 100%",
    label: {
      fontWeight: "$bold",
    },
  },
  ".box": {
    flex: 1,
    maxWidth: "$512",
    h2: {
      fontWeight: "$bold",
    },
  },
});

export const ManageInternalWork: FC = () => {
  const [userId, setUserID] = useState("");
  const { users } = useUsersInfo();

  const {
    internalWorks: internalWorksWithoutStatus,
    mutate: mutateWithoutStatus,
  } = useInternalWorks({
    withoutStatus: true,
    userId,
  });
  const { internalWorks: internalWorksWithStatus, mutate: mutateWithStatus } =
    useInternalWorks({
      withoutStatus: false,
      userId,
    });

  const onChange = useCallback(() => {
    mutateWithoutStatus();
    mutateWithStatus();
  }, [mutateWithoutStatus, mutateWithStatus]);

  return (
    <ManageInternalWorkSC>
      <Group className="row">
        <Select
          data={users.map((user) => ({
            label: user.full_name,
            value: user.id,
          }))}
          label="Utilisateur sélectionné"
          placeholder="Choisir un utilisateur"
          onChange={(value) => setUserID(value || "")}
          clearable
        />
      </Group>
      <BoxSC className="box">
        <h2>Travaux internes non traités</h2>
        {internalWorksWithoutStatus.length === 0 ? (
          <p>{"Il n'y a aucun travail interne à traiter"}</p>
        ) : (
          <ManageInternalWorkList
            internalWorks={internalWorksWithoutStatus}
            onChange={onChange}
          />
        )}
      </BoxSC>
      <BoxSC className="box">
        <h2>Travaux internes traités</h2>
        {internalWorksWithStatus.length === 0 ? (
          <p>{"Il n'y a aucun travail interne traité"}</p>
        ) : (
          <ManageInternalWorkList
            internalWorks={internalWorksWithStatus}
            onChange={onChange}
          />
        )}
      </BoxSC>
    </ManageInternalWorkSC>
  );
};
