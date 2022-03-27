import { WorkScheduleTaskFull } from "./workScheduleTask";

export function FilterWorkScheduleTask(
  excludedPlannings: string[],
  excludedUsers: string[]
) {
  return (task: WorkScheduleTaskFull) => {
    return (
      !excludedPlannings.includes(task.schedule.id) &&
      !task.users.every(({ id }) => excludedUsers.includes(id))
    );
  };
}
