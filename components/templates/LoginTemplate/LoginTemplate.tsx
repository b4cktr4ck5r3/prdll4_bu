import { Login, SideBar } from "@components/organisms";
import { styled } from "@stitches";
import type { FC } from "react";

const LoginLayoutSC = styled("div", {
  background: "$neutral1",
  display: "flex",
  minHeight: "100vh",
});

const MainSC = styled("main", {
  position: "relative",
  flex: "1 0 0%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const VersionningSC = styled("span", {
  color: "$neutral7",
  position: "absolute",
  right: "$4",
  bottom: "$4",
  lineHeight: 1,
});

export const LoginTemplate: FC = () => {
  return (
    <LoginLayoutSC>
      <SideBar />
      <MainSC>
        <Login />
        <VersionningSC>v1.1.0</VersionningSC>
      </MainSC>
    </LoginLayoutSC>
  );
};
