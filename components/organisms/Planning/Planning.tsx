import { BoxSC } from "@components/atoms";
import { BigCalendar } from "@components/molecules";
import { styled } from "@stitches";
import type { FC } from "react";

export const PlanningSC = styled("div");

export const Planning: FC = () => {
  return (
    <PlanningSC>
      <BoxSC>
        <BigCalendar />
      </BoxSC>
    </PlanningSC>
  );
};
