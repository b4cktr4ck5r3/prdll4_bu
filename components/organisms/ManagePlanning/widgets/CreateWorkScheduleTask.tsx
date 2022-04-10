import { CircleFilled20 } from "@carbon/icons-react";
import { BasicForm } from "@components/molecules";
import { WorkScheduleTaskFormType, workScheduleTaskInputs } from "@data/form";
import useUsersBusy from "@hooks/useUsersBusy";
import useUsersInfo from "@hooks/useUsersInfo";
import useWorkScheduleTasks from "@hooks/useWorkScheduleTasks";
import { Button, Group } from "@mantine/core";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { styled } from "@stitches";
import { GetEventLabel } from "@utils/calendar";
import axios from "axios";
import clsx from "clsx";
import dayjs from "dayjs";
import { FC, useCallback, useMemo, useRef, useState } from "react";

export const CreateWorkScheduleTaskSC = styled("section", {
  ".box-busy": {
    padding: "$12 0 $4",
    ul: {
      "li + li": {
        marginTop: "$2",
      },
    },
  },
});

export type CreateWorkScheduleTaskProps = {
  hidden?: boolean;
  workScheduleId: string;
};

export const CreateWorkScheduleTask: FC<CreateWorkScheduleTaskProps> = ({
  hidden = false,
  workScheduleId,
}) => {
  const { workScheduleTasks, mutate: mutateWorkScheduleTasks } =
    useWorkScheduleTasks({ workScheduleId });
  const { users } = useUsersInfo();
  const formNewWST = useRef<UseForm<WorkScheduleTaskFormType>>();
  const [currentDates, setCurrentDates] = useState([new Date(), new Date()]);
  const [currentUsers, setCurrentUsers] = useState<string[]>([]);

  const generateFormDates = useCallback(
    (date: Date, [startDate, endDate]: [Date, Date]) => {
      const start = dayjs(date)
        .millisecond(0)
        .second(0)
        .minute(startDate.getMinutes())
        .hour(startDate.getHours())
        .toDate();

      const end = dayjs(date)
        .millisecond(0)
        .second(0)
        .minute(endDate.getMinutes())
        .hour(endDate.getHours())
        .toDate();

      return [start, end];
    },
    []
  );
  const updateCurrentDates = useCallback(
    (date?: Date, time?: Date[]) => {
      if (formNewWST.current && date && time && time.length === 2) {
        setCurrentDates(generateFormDates(date, time as [Date, Date]));
      }
    },
    [generateFormDates]
  );

  const { usersBusy, mutate } = useUsersBusy({
    startDate: currentDates[0],
    endDate: currentDates[1],
  });

  const currentUsersBusy = useMemo(() => {
    return usersBusy.filter(({ user }) => currentUsers.includes(user.id));
  }, [currentUsers, usersBusy]);

  return (
    <CreateWorkScheduleTaskSC className={clsx({ hidden: hidden })}>
      <h2 className="title mb-xs center">Ajouter une séance</h2>
      <form
        onSubmit={(event) => {
          formNewWST.current?.onSubmit(({ date, name, time, users }) => {
            const [startDate, endDate] = generateFormDates(
              date,
              time as [Date, Date]
            );

            axios
              .post("/api/workScheduleTask", {
                name,
                startDate,
                endDate,
                users,
                workScheduleId,
              })
              .then(() => mutateWorkScheduleTasks())
              .then(() => mutate())
              .then(() => alert("Séance ajoutée"));
          })(event);
        }}
      >
        <BasicForm
          {...workScheduleTaskInputs()}
          listData={{
            name: workScheduleTasks
              .map((e) => e.name)
              .filter((e, i, a) => a.indexOf(e) === i),
            users: users.map((user) => ({
              label: user.full_name,
              value: user.id,
            })),
          }}
          setForm={(form: UseForm<WorkScheduleTaskFormType>) =>
            (formNewWST.current = form)
          }
          onChange={{
            date: (date: Date) =>
              updateCurrentDates(date, formNewWST.current?.values.time),
            time: (time: Date[]) =>
              updateCurrentDates(formNewWST.current?.values.date, time),
            users: (users: string[]) => setCurrentUsers(users),
          }}
        />
        <div className="box-busy">
          {currentUsersBusy.length === 0 ? (
            <p>
              <CircleFilled20 color="green" />
              <span>Tous les tuteurs sélectionnés sont disponibles</span>
            </p>
          ) : (
            <ul>
              {currentUsersBusy.map((item) => (
                <li key={item.id}>
                  <CircleFilled20 color="red" />
                  <span>
                    <span style={{ fontWeight: "bold" }}>
                      [{GetEventLabel(item.type)}]
                    </span>{" "}
                    {item.user.full_name} de{" "}
                    {dayjs(item.startDate).format("HH:mm")} à{" "}
                    {dayjs(item.endDate).format("HH:mm")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Group>
          <Button mt="sm" type="submit">
            {"Créer la séance"}
          </Button>
          <Button
            mt="sm"
            variant="outline"
            onClick={() => {
              formNewWST.current?.reset();
            }}
          >
            {"Réinitialiser les données"}
          </Button>
        </Group>
      </form>
    </CreateWorkScheduleTaskSC>
  );
};
