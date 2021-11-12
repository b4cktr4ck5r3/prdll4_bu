import { CPlannerVertical } from "@components/icons";
import { styled } from "@stitches";
import { FC } from "react";

export const SideBarSC = styled("header", {
  background: "$primary7",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "$sidebar",
  height: "100vh",
});

export const SideBar: FC = () => {
  return (
    <SideBarSC>
      <CPlannerVertical />
    </SideBarSC>
  );
};
