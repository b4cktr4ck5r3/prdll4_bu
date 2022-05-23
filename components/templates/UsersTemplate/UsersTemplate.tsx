import { UsersBoxSC } from "@components/atoms";
import { DefaultLayout } from "@components/layouts";
import { UserForm } from "@components/organisms";
import { Button, Modal, SegmentedControl } from "@mantine/core";
import { styled } from "@stitches";
import { Role, UserSimplified } from "@utils/user";
import { ResetPasswordInfo } from "@utils/user/Password";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FC, useCallback, useEffect, useState } from "react";

export const UserRowSC = styled("li", {
  h3: {
    fontWeight: "bold",
  },
  "div.infos": {
    color: "$neutral6",
    fontSize: "$sm",
  },
  "ul.actions": {
    marginTop: "$4",
    "li + li": {
      marginTop: "$4",
    },
  },
  "& + &": {
    marginTop: "$12",
  },
});

export const UsersTemplateSC = styled("div", {
  maxWidth: "$512",
  "& > * + *": {
    marginTop: "$24",
  },
});

export const UsersTemplate: FC = () => {
  const { data } = useSession();
  const [filterStatusUser, setFilterStatusUser] = useState<
    "true" | "false" | "null"
  >("true");
  const [currentUsers, setCurrentUsers] = useState<UserSimplified[]>([]);
  const [newPasswordInfo, setNewPasswordInfo] =
    useState<ResetPasswordInfo | null>(null);

  const searchUsers = useCallback(() => {
    axios
      .get<UserSimplified[]>("/api/user")
      .then(({ data }) => setCurrentUsers(data));
  }, []);

  const getUserFullName = useCallback(
    (userId: string) => {
      return currentUsers.find((user) => user.id === userId)?.full_name;
    },
    [currentUsers]
  );

  const resetUserPassword = useCallback(
    (userId: string) => {
      if (
        confirm(
          `Êtes-vous sûr de vouloir réinitialiser le mot de passe de "${getUserFullName(
            userId
          )}"`
        )
      ) {
        axios
          .post<ResetPasswordInfo>(`/api/user/${userId}/reset_password`)
          .then(({ data }) => setNewPasswordInfo(data))
          .catch(() => alert("Error reset password"));
      }
    },
    [getUserFullName]
  );

  const changeStatusUser = useCallback(
    (userId: string, value: boolean) => {
      if (
        confirm(
          `Êtes-vous sûr de vouloir changer le statut de "${getUserFullName(
            userId
          )}"`
        )
      ) {
        const endpoint = value ? "activate" : "deactivate";
        axios
          .post(`/api/user/${userId}/${endpoint}`)
          .then(searchUsers)
          .catch(() => alert("Error disable user"));
      }
    },
    [getUserFullName, searchUsers]
  );

  const upgradeUserRole = useCallback(
    (userId: string) => {
      if (
        confirm(
          `Êtes-vous sûr de vouloir améliorer le role de "${getUserFullName(
            userId
          )}"`
        )
      )
        axios
          .post(`/api/user/${userId}/promote`)
          .then(searchUsers)
          .catch(() => alert("Error upgrade role"));
    },
    [getUserFullName, searchUsers]
  );

  useEffect(searchUsers, [searchUsers]);

  return (
    <DefaultLayout>
      <UsersTemplateSC>
        <UsersBoxSC>
          <h2 className="title">Liste des utilisateurs</h2>
          <SegmentedControl
            data={[
              { label: "Tous", value: "null" },
              { label: "Actif", value: "true" },
              { label: "Inactif", value: "false" },
            ]}
            value={filterStatusUser}
            onChange={(value: "true" | "false" | "null") =>
              setFilterStatusUser(value)
            }
            style={{ marginTop: 0 }}
          />
          <ul>
            {currentUsers
              .filter(
                ({ active }) =>
                  filterStatusUser === "null" ||
                  (filterStatusUser === "true" && active) ||
                  (filterStatusUser === "false" && !active)
              )
              .map((user) => {
                return (
                  <UserRowSC key={user.id}>
                    <h3>{user.full_name}</h3>
                    <div className="infos">
                      <div>ID : {user.id}</div>
                      <div>
                        {"Nom d'utilisateur"} : {user.username}
                      </div>
                      <div>Role : {user.role}</div>
                    </div>
                    <ul className="actions">
                      {data?.user?.sub !== user.id && (
                        <li>
                          <Button
                            size="xs"
                            color="indigo"
                            onClick={() => resetUserPassword(user.id)}
                          >
                            Changer le mot de passe
                          </Button>
                        </li>
                      )}
                      {user.role !== Role.ADMIN && (
                        <>
                          <li>
                            <Button
                              size="xs"
                              color="orange"
                              onClick={() => upgradeUserRole(user.id)}
                            >
                              Transformer en administrateur
                            </Button>
                          </li>
                          <li>
                            {
                              <Button
                                size="xs"
                                color={user.active ? "red" : "teal"}
                                onClick={() =>
                                  changeStatusUser(user.id, !user.active)
                                }
                              >
                                {user.active
                                  ? "Désactiver le compte"
                                  : "Réactiver le compte"}
                              </Button>
                            }
                          </li>
                        </>
                      )}
                    </ul>
                  </UserRowSC>
                );
              })}
          </ul>
        </UsersBoxSC>
        <UsersBoxSC>
          <h2 className="title">Ajouter un utilisateur</h2>
          <UserForm onNew={searchUsers} />
        </UsersBoxSC>
        <div style={{ marginBottom: "24px" }} />
        <Modal
          opened={Boolean(newPasswordInfo)}
          onClose={() => setNewPasswordInfo(null)}
          title="Nouveau mot de passe"
          centered
        >
          <div>Utilisateur : {newPasswordInfo?.userName}</div>
          <div>Mot de passe temporaire: {newPasswordInfo?.newPassword}</div>
        </Modal>
      </UsersTemplateSC>
    </DefaultLayout>
  );
};
