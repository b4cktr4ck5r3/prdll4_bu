import { DefaultLayout } from "@components/layouts";
import {
  CreatePlanning,
  ManagePlanning,
  ManageWorkScheduleTaskName,
} from "@components/organisms";
import { Group } from "@mantine/core";
import { styled } from "@stitches";
import { FC } from "react";

export const ManagePlanningTemplateSC = styled("div", {
  "& > * + *": {
    marginTop: "$16",
  },
});

export const ManagePlanningTemplate: FC = () => {
  return (
    <DefaultLayout>
      <ManagePlanningTemplateSC>
        <Group>
          <CreatePlanning />
          <ManageWorkScheduleTaskName />
        </Group>
        <ManagePlanning />
      </ManagePlanningTemplateSC>
    </DefaultLayout>
  );
};
