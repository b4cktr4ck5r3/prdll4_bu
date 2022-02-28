import { ScheduleBoxSC } from "@components/atoms";
import { styled } from "@stitches";
import type { FC } from "react";
import { SelectPlanning } from "./widgets";

export const ManagePlanningSC = styled("div", ScheduleBoxSC, {
  //
});

export const ManagePlanning: FC = () => {
  return (
    <ManagePlanningSC>
      <SelectPlanning />
      <section>
        <h2 className="title">Toutes les séances</h2>
      </section>
      <section>
        <h2 className="title">Ajouter une séance</h2>
      </section>
    </ManagePlanningSC>
  );
};
