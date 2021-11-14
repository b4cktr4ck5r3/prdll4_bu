import { CPlannerVertical } from "@components/icons";
import { styled } from "@stitches";
import { FC } from "react";

export const SideBarSC = styled("header", {
  display: "none",
  background: "$primary7",
  color: "white",
  justifyContent: "center",
  alignItems: "center",
  width: "$sidebar",
  height: "100vh",
  "@tablet": {
    display: "flex",
  },
});

export const SideBar: FC = () => {
  return (
    <SideBarSC>
      <CPlannerVertical />
    </SideBarSC>
  );
};
