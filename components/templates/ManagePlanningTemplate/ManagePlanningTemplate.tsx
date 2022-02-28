import { DefaultLayout } from "@components/layouts";
import { CreatePlanning, ManagePlanning } from "@components/organisms";
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
        <CreatePlanning />
        <ManagePlanning />
      </ManagePlanningTemplateSC>
    </DefaultLayout>
  );
};
