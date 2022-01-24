import { DefaultLayout } from "@components/layouts";
import { Planning, SimplePlanning } from "@components/organisms";
import { useViewportSize } from "@mantine/hooks";
import { bp } from "@stitches";
import type { FC } from "react";

export const PlanningTemplate: FC = () => {
  const { width } = useViewportSize();
  return (
    <DefaultLayout>
      {width < bp.desktop ? <SimplePlanning /> : <Planning />}
    </DefaultLayout>
  );
};
