import { DefaultLayout } from "@components/layouts";
import { ManageTimeReport } from "@components/organisms";
import { styled } from "@stitches";
import type { FC } from "react";

export const TimeReportTemplateSC = styled("div", {
  maxWidth: "$640",
});

export const TimeReportTemplate: FC = () => {
  return (
    <DefaultLayout>
      <TimeReportTemplateSC>
        <ManageTimeReport />
      </TimeReportTemplateSC>
    </DefaultLayout>
  );
};
