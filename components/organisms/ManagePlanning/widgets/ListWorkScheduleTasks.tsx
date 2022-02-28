import useWorkScheduleTasks from "@hooks/useWorkScheduleTasks";
import type { FC } from "react";

export type ListWorkScheduleTasksProps = {
  workScheduleId: string;
};

export const ListWorkScheduleTasks: FC<ListWorkScheduleTasksProps> = ({
  workScheduleId,
}) => {
  const { workScheduleTasks } = useWorkScheduleTasks(workScheduleId);
  return (
    <section>
      <h2 className="title">Toutes les séances</h2>
      <ul>
        {workScheduleTasks.map((task) => (
          <li key={task.id}>
            <div>{task.name}</div>
            <div>{task.startDate}</div>
            <div>{task.endDate}</div>
          </li>
        ))}
      </ul>
    </section>
  );
};
