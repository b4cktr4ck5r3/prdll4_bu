import { ArrowLeft20, ArrowRight20 } from "@carbon/icons-react";
import { CardEventWorkScheduleTask } from "@components/molecules/CardEvent/CardEventWorkScheduleTask";
import { usePlannings, useWorkScheduleTasks } from "@hooks";
import { ActionIcon } from "@mantine/core";
import { styled } from "@stitches";
import { GetMonthLabel } from "@utils/calendar";
import clsx from "clsx";
import dayjs from "dayjs";
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
  const [currentDate, setCurrentDate] = useState(dayjs().toDate());
  const { startDate, endDate } = useMemo(() => {
    const start = dayjs(currentDate)
      .date(1)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    const end = dayjs(start)
      .month(start.month() + 1)
      .date(0)
      .hour(23)
      .minute(59)
      .second(59)
      .millisecond(999);
    return {
      startDate: start.toDate(),
      endDate: end.toDate(),
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
      setCurrentDate(dayjs(currentPlanning.startDate).toDate());
    } else setCurrentDate(dayjs().toDate());
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
              const newDate = dayjs(date).toDate();
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
              const newDate = dayjs(date).toDate();
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
