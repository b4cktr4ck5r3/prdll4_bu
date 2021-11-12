import { DefaultLayout } from "@components/layouts";
import { UnavailabilityForm } from "@components/organisms";
import { Group } from "@mantine/core";
import type { FC } from "react";

export const UnavailabilityTemplate: FC = () => {
  return (
    <DefaultLayout>
      <Group align="stretch" style={{ padding: "0 12px", marginTop: "4px" }}>
        <div>Mini Calendar</div>
        <UnavailabilityForm />
      </Group>
    </DefaultLayout>
  );
};
