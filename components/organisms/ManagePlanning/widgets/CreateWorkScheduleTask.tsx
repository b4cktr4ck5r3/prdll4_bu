import { BasicForm } from "@components/molecules";
import { WorkScheduleTaskFormType, workScheduleTaskInputs } from "@data/form";
import useUsersInfo from "@hooks/useUsersInfo";
import useWorkScheduleTasks from "@hooks/useWorkScheduleTasks";
import { Button, Group } from "@mantine/core";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import axios from "axios";
import clsx from "clsx";
import dayjs from "dayjs";
import { FC, useRef } from "react";

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

  return (
    <section className={clsx({ hidden: hidden })}>
      <h2 className="title mb-xs center">Ajouter une séance</h2>
      <form
        onSubmit={(event) => {
          formNewWST.current?.onSubmit(
            ({ date, name, time: [startDate, endDate], users }) => {
              const start = dayjs(date)
                .millisecond(0)
                .second(0)
                .minute(startDate.getMinutes())
                .hour(startDate.getHours());

              const end = dayjs(date)
                .millisecond(0)
                .second(0)
                .minute(endDate.getMinutes())
                .hour(endDate.getHours());

              axios
                .post("/api/workScheduleTask", {
                  name,
                  startDate: start.toDate(),
                  endDate: end.toDate(),
                  users,
                  workScheduleId,
                })
                .then(() => mutateWorkScheduleTasks())
                .then(() => alert("Séance ajoutée"));
            }
          )(event);
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
        />
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
    </section>
  );
};
