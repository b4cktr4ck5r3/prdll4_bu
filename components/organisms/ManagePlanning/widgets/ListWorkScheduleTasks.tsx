import { CardEventWorkScheduleTask } from "@components/molecules/CardEvent/CardEventWorkScheduleTask";
import useWorkScheduleTasks from "@hooks/useWorkScheduleTasks";
import { styled } from "@stitches";
import dayjs from "dayjs";
import type { FC } from "react";

export type ListWorkScheduleTasksProps = {
  workScheduleId: string;
};

const WorkScheduleTasksSC = styled("ul", {
  "& > * + *": {
    marginTop: "$12",
  },
  ".name": {
    fontWeight: "bold",
  },
});

export const ListWorkScheduleTasks: FC<ListWorkScheduleTasksProps> = ({
  workScheduleId,
}) => {
  const { workScheduleTasks } = useWorkScheduleTasks({ workScheduleId });
  if (workScheduleTasks.length === 0) return null;
  return (
    <section>
      <h2 className="title">Toutes les séances</h2>
      <WorkScheduleTasksSC>
        {workScheduleTasks.map((task) => (
          <CardEventWorkScheduleTask key={task.id} workScheduleTask={task} />
        ))}
      </WorkScheduleTasksSC>
    </section>
  );
};
