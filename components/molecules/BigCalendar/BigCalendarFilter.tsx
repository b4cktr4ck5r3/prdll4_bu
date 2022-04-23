import { usePlannings, useUsersInfo } from "@hooks";
import { BigCalendarContext } from "@lib/contexts";
import { Checkbox } from "@mantine/core";
import { styled } from "@stitches";
import { FC, useContext } from "react";

export const BigCalendarFilterSC = styled("div", {
  marginTop: "$24",
  display: "flex",
  "& > * ": {
    maxWidth: "$384",
    flex: 1,
  },
  ul: {
    marginTop: "$4",
  },
  "li + li": {
    marginTop: "$2",
  },
});

export const BigCalendarFilter: FC = () => {
  const {
    excludedPlannings,
    excludedUsers,
    excludedPlanningsHandlers,
    excludedUsersHandlers,
  } = useContext(BigCalendarContext);
  const { plannings } = usePlannings();
  const { users } = useUsersInfo();

  return (
    <BigCalendarFilterSC>
      <div>
        <h3>Liste des plannings</h3>
        <ul>
          {plannings.map((planning) => {
            const checked = !excludedPlannings.includes(planning.id);
            return (
              <li key={planning.id}>
                <Checkbox
                  checked={checked}
                  label={planning.name}
                  onChange={(event) => {
                    event.currentTarget.checked
                      ? excludedPlanningsHandlers?.remove(
                          excludedPlannings.indexOf(planning.id)
                        )
                      : excludedPlanningsHandlers?.append(planning.id);
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h3>Liste des utilisateurs</h3>
        <ul>
          {users.map((user) => {
            const checked = !excludedUsers.includes(user.id);
            return (
              <li key={user.id}>
                <Checkbox
                  checked={checked}
                  label={user.full_name}
                  onChange={(event) => {
                    event.currentTarget.checked
                      ? excludedUsersHandlers?.remove(
                          excludedUsers.indexOf(user.id)
                        )
                      : excludedUsersHandlers?.append(user.id);
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </BigCalendarFilterSC>
  );
};
