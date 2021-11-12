import { DefaultLayout } from "@components/layouts";
import { SimplePlanning } from "@components/organisms";
import { Group } from "@mantine/core";
import type { FC } from "react";

export const HomeTemplate: FC = () => {
  return (
    <DefaultLayout>
      <Group align="stretch" style={{ padding: "0 12px", marginTop: "4px" }}>
        <SimplePlanning />
      </Group>
    </DefaultLayout>
  );
};
