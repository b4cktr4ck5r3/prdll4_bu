import { useUnavailabilities, useWorkScheduleTasks } from "@hooks";
import { User } from "@prisma/client";
import { Event } from "@utils/calendar";
import dayjs from "dayjs";
import { useMemo } from "react";

export type UserBusyInfo = {
  id: string;
  user: User;
  startDate: Date;
  endDate: Date;
  type: Event;
};

export type useUsersInfoProps = {
  startDate: Date;
  endDate: Date;
};

export function useUsersBusy({ startDate, endDate }: useUsersInfoProps) {
  const { unavailabilities, mutate: mutateUnavailabilities } =
    useUnavailabilities({
      startDate,
      endDate,
      acceptEqualDate: false,
    });
  const { workScheduleTasks, mutate: mutateWST } = useWorkScheduleTasks({
    startDate,
    endDate,
    acceptEqualDate: false,
  });

  const usersBusy = useMemo<UserBusyInfo[]>(() => {
    return unavailabilities
      .map<UserBusyInfo>((item) => ({
        id: item.id,
        user: item.user,
        type: Event.Unavailability,
        startDate: dayjs(item.startDate).toDate(),
        endDate: dayjs(item.endDate).toDate(),
      }))
      .concat(
        workScheduleTasks
          .map<UserBusyInfo[]>((item) =>
            item.users.map<UserBusyInfo>((user) => ({
              id: item.id,
              user,
              type: Event.Course,
              startDate: dayjs(item.startDate).toDate(),
              endDate: dayjs(item.endDate).toDate(),
            }))
          )
          .flat()
      );
  }, [unavailabilities, workScheduleTasks]);

  return {
    usersBusy,
    mutate: () => {
      mutateUnavailabilities();
      mutateWST();
    },
  };
}
