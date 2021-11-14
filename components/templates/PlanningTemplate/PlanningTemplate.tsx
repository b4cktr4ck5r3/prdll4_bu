import { DefaultLayout } from "@components/layouts";
import { Planning, SimplePlanning } from "@components/organisms";
import { useViewportSize } from "@mantine/hooks";
import { Event } from "@utils/calendar";
import type { FC } from "react";

export const PlanningTemplate: FC = () => {
  const { width } = useViewportSize();
  return (
    <DefaultLayout>
      {width <= 768 ? <SimplePlanning type={Event.Course} /> : <Planning />}
    </DefaultLayout>
  );
};
