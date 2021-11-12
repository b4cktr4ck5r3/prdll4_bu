import { CPlannerHorizontal } from "@components/icons";
import { styled } from "@stitches";
import type { FC } from "react";

export const LoadingLayoutSC = styled("div", {
  background: "$neutral1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  color: "$primary7",
});

export const LoadingTemplate: FC = () => {
  return (
    <LoadingLayoutSC>
      <CPlannerHorizontal />
    </LoadingLayoutSC>
  );
};
