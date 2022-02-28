import { ScheduleBoxSC } from "@components/atoms";
import { styled } from "@stitches";
import { FC, useState } from "react";
import {
  CreateWorkScheduleTask,
  ListWorkScheduleTasks,
  SelectPlanning,
} from "./widgets";

export const ManagePlanningSC = styled("div", ScheduleBoxSC, {
  //
});

export const ManagePlanning: FC = () => {
  const [selectedPlanning, setSelectedPlanning] = useState("");

  return (
    <ManagePlanningSC>
      <SelectPlanning value={selectedPlanning} onChange={setSelectedPlanning} />
      {selectedPlanning && (
        <>
          <ListWorkScheduleTasks workScheduleId={selectedPlanning} />
          <CreateWorkScheduleTask workScheduleId={selectedPlanning} />
        </>
      )}
    </ManagePlanningSC>
  );
};
