import { CPlannerVertical } from "@components/icons";
import { styled } from "@stitches";
import { FC } from "react";

export const SideBarSC = styled("header", {
  display: "flex",
  background: "$primary7",
  color: "white",
  justifyContent: "center",
  alignItems: "center",
  width: "$sidebar",
  height: "100vh",
  "@mobile": {
    display: "none",
  },
});

export const SideBar: FC = () => {
  return (
    <SideBarSC>
      <CPlannerVertical />
    </SideBarSC>
  );
};
