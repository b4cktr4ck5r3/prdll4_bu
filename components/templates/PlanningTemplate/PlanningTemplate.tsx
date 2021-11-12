import { DefaultLayout } from "@components/layouts";
import { Planning } from "@components/organisms";
import type { FC } from "react";

export const PlanningTemplate: FC = () => {
  return (
    <DefaultLayout>
      <Planning />
    </DefaultLayout>
  );
};
