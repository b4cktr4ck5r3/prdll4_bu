import { Modal, Text } from "@mantine/core";
import { styled } from "@stitches";
import { DateSimplified } from "@utils/calendar";
import { DateSimplifiedToString } from "@utils/calendar/DateSimplifiedToString";
import { FormatHourRange } from "@utils/calendar/FormatHourRange";
import { UnavailabilityFull } from "@utils/unavailability";
import { WorkScheduleTaskFull } from "@utils/workScheduleTask";
import type { FC } from "react";

export type BigCalendarModalProps = {
  onClose: () => void;
  date?: DateSimplified;
  unavailabilities?: UnavailabilityFull[];
  workScheduleTasks?: WorkScheduleTaskFull[];
};

export const BigCalendarModalSC = styled("div", {
  "& > ul + h2": {
    marginTop: "$12",
    paddingTop: "$8",
    borderTop: "1px solid lightgray",
  },
  h2: {
    marginBottom: "$2",
  },
  "ul > li + li": {
    marginTop: "$2",
  },
});

export const BigCalendarModal: FC<BigCalendarModalProps> = ({
  date,
  onClose,
  unavailabilities = [],
  workScheduleTasks = [],
}) => {
  if (!date) return null;
  else
    return (
      <Modal
        opened={true}
        onClose={onClose}
        title={
          <Text size="xl" weight={"bold"}>
            {DateSimplifiedToString(date)}
          </Text>
        }
      >
        <BigCalendarModalSC>
          {unavailabilities.length > 0 && (
            <>
              <Text component="h2" size="lg" weight="bold">
                Indisponibilités
              </Text>
              <ul>
                {unavailabilities.map(({ startDate, endDate, id, user }) => (
                  <li key={id}>
                    <Text size="md">
                      <span style={{ fontWeight: "bold" }}>
                        {FormatHourRange(startDate, endDate)}
                      </span>
                      {" : "}
                      {user.full_name}
                    </Text>
                  </li>
                ))}
              </ul>
            </>
          )}
          {workScheduleTasks.length > 0 && (
            <>
              <Text component="h2" size="lg" weight="bold">
                Cours
              </Text>
              <ul>
                {workScheduleTasks.map(
                  ({ startDate, endDate, id, users, name }) => (
                    <li key={id}>
                      <Text size="md">
                        <span style={{ fontWeight: "bold" }}>
                          {FormatHourRange(startDate, endDate)}
                        </span>
                        {" : "}
                        {name}
                        {users.map((user) => (
                          <Text
                            key={user.id}
                            lineClamp={1}
                            color="gray"
                            size="sm"
                          >
                            {`@${user.full_name}`}
                          </Text>
                        ))}
                      </Text>
                    </li>
                  )
                )}
              </ul>
            </>
          )}
        </BigCalendarModalSC>
      </Modal>
    );
};
