import useWorkScheduleTasks from "@hooks/useWorkScheduleTasks";
import { styled } from "@stitches";
import dayjs from "dayjs";
import type { FC } from "react";

export type ListWorkScheduleTasksProps = {
  workScheduleId: string;
};

const WorkScheduleTasksItemSC = styled("li", {
  "& + &": {
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
      <ul>
        {workScheduleTasks.map((task) => (
          <WorkScheduleTasksItemSC key={task.id}>
            <div className="name">{task.name}</div>
            <div>
              {`${dayjs(task.startDate).format("HH:mm")} - ${dayjs(
                task.endDate
              ).format("HH:mm")}`}
            </div>
            <div>Par {task.users.map((user) => user.full_name).join(", ")}</div>
          </WorkScheduleTasksItemSC>
        ))}
      </ul>
    </section>
  );
};
