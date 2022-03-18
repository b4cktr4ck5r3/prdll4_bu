import { CardEventWorkScheduleTask } from "@components/molecules/CardEvent/CardEventWorkScheduleTask";
import useWorkScheduleTasks from "@hooks/useWorkScheduleTasks";
import { styled } from "@stitches";
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
  const { workScheduleTasks, mutate } = useWorkScheduleTasks({
    workScheduleId,
  });

  if (workScheduleTasks.length === 0) return null;
  return (
    <section>
      <h2 className="title">Toutes les séances</h2>
      <WorkScheduleTasksSC>
        {workScheduleTasks.map((task) => (
          <CardEventWorkScheduleTask
            key={task.id}
            workScheduleTask={task}
            deletable
            onDelete={mutate}
          />
        ))}
      </WorkScheduleTasksSC>
    </section>
  );
};
