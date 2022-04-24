import { ScheduleBoxSC } from "@components/atoms";
import { SegmentedControl } from "@mantine/core";
import { styled } from "@stitches";
import { FC, useState } from "react";
import {
  CreateWorkScheduleTask,
  ListWorkScheduleTasks,
  SelectPlanning,
} from "./widgets";

export type ViewType = "list" | "create";

export const ManagePlanningSC = styled("div", ScheduleBoxSC, {
  maxWidth: "$640",
  ".select-view-wrapper": {
    display: "flex",
    justifyContent: "center",
  },
  "& > * + *": {
    marginTop: "$16",
  },
});

export const ManagePlanning: FC = () => {
  const [selectedPlanning, setSelectedPlanning] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>("list");

  return (
    <ManagePlanningSC>
      <SelectPlanning value={selectedPlanning} onChange={setSelectedPlanning} />
      {selectedPlanning && (
        <>
          <div className="select-view-wrapper">
            <SegmentedControl
              data={[
                { label: "Liste", value: "list" },
                { label: "Création", value: "create" },
              ]}
              value={view}
              onChange={(value: ViewType) => setView(value)}
            />
          </div>
          <ListWorkScheduleTasks
            hidden={view !== "list"}
            workScheduleId={selectedPlanning}
          />
          <CreateWorkScheduleTask
            hidden={view !== "create"}
            workScheduleId={selectedPlanning}
          />
        </>
      )}
    </ManagePlanningSC>
  );
};
