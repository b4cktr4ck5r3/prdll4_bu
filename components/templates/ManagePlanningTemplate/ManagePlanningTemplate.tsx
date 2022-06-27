import { DefaultLayout } from "@components/layouts";
import { CreatePlanning, ManagePlanning } from "@components/organisms";
import { Button, Group } from "@mantine/core";
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
          <Button>Gestion des modèles de cours</Button>
        </Group>
        <ManagePlanning />
      </ManagePlanningTemplateSC>
    </DefaultLayout>
  );
};
