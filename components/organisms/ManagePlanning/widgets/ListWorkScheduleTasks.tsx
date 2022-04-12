import { ArrowLeft20, ArrowRight20 } from "@carbon/icons-react";
import { CardEventWorkScheduleTask } from "@components/molecules/CardEvent/CardEventWorkScheduleTask";
import usePlannings from "@hooks/usePlannings";
import useWorkScheduleTasks from "@hooks/useWorkScheduleTasks";
import { ActionIcon } from "@mantine/core";
import { styled } from "@stitches";
import { GetDaysInMonth, GetMonthLabel } from "@utils/calendar";
import clsx from "clsx";
import { FC, useEffect, useMemo, useState } from "react";

export type ListWorkScheduleTasksProps = {
  hidden?: boolean;
  workScheduleId: string;
};

const WorkScheduleTasksSC = styled("section", {
  ".tasks-header": {
    position: "relative",
    padding: "0 36px",
    ".left-arrow, .right-arrow": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
    },
    ".left-arrow": {
      left: "4px",
    },
    ".right-arrow": {
      right: "4px",
    },
  },
  ".tasks-wrapper": {
    "& > * + *": {
      marginTop: "$12",
    },
    ".name": {
      fontWeight: "bold",
    },
  },
  ".tasks-placeholder": {
    textAlign: "center",
  },
});

export const ListWorkScheduleTasks: FC<ListWorkScheduleTasksProps> = ({
  hidden = false,
  workScheduleId,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { startDate, endDate } = useMemo(() => {
    const weeksOfMonth = GetDaysInMonth(currentDate);
    const firstDate = weeksOfMonth[0][0];
    const lastDate = weeksOfMonth[weeksOfMonth.length - 1][6];

    return {
      startDate: new Date(firstDate.year, firstDate.month, firstDate.date),
      endDate: new Date(lastDate.year, lastDate.month, lastDate.date),
    };
  }, [currentDate]);

  const { plannings } = usePlannings();
  const { workScheduleTasks, mutate } = useWorkScheduleTasks({
    workScheduleId,
    startDate,
    endDate,
  });

  useEffect(() => {
    const currentPlanning = plannings.find(({ id }) => id === workScheduleId);
    if (currentPlanning) {
      setCurrentDate(new Date(currentPlanning.startDate));
    } else setCurrentDate(new Date());
  }, [plannings, workScheduleId]);

  const monthLabel = useMemo(() => GetMonthLabel(currentDate), [currentDate]);

  return (
    <WorkScheduleTasksSC className={clsx({ hidden: hidden })}>
      <div className="tasks-header">
        <ActionIcon
          className="left-arrow"
          variant="default"
          onClick={() =>
            setCurrentDate((date) => {
              const newDate = new Date(date);
              newDate.setMonth(newDate.getMonth() - 1);
              return newDate;
            })
          }
        >
          <ArrowLeft20 />
        </ActionIcon>
        <ActionIcon
          className="right-arrow"
          variant="default"
          onClick={() =>
            setCurrentDate((date) => {
              const newDate = new Date(date);
              newDate.setMonth(newDate.getMonth() + 1);
              return newDate;
            })
          }
        >
          <ArrowRight20 />
        </ActionIcon>
        <h2 className="title center">
          Toutes les séances de <span className="capitalize">{monthLabel}</span>{" "}
          {currentDate.getFullYear()}
        </h2>
      </div>
      {workScheduleTasks.length === 0 ? (
        <p className="tasks-placeholder">Aucune séance</p>
      ) : (
        <ul className="tasks-wrapper">
          {workScheduleTasks.map((task) => (
            <CardEventWorkScheduleTask
              key={task.id}
              workScheduleTask={task}
              buttonType={"DELETE"}
              buttonCallback={mutate}
            />
          ))}
        </ul>
      )}
    </WorkScheduleTasksSC>
  );
};
