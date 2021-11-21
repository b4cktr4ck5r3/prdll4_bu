import { NextPage } from "next";
import { FC } from "react";

export function GetDisplayName(WrappedComponent: FC | NextPage) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
