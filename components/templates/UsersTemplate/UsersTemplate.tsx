import { UsersBoxSC } from "@components/atoms";
import { DefaultLayout } from "@components/layouts";
import { UserForm } from "@components/organisms";
import { Button, Modal } from "@mantine/core";
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
  const [currentUsers, setCurrentUsers] = useState<UserSimplified[]>([]);
  const [newPasswordInfo, setNewPasswordInfo] =
    useState<ResetPasswordInfo | null>(null);

  const searchUsers = useCallback(() => {
    axios
      .get<UserSimplified[]>("/api/user")
      .then(({ data }) => setCurrentUsers(data));
  }, []);

  const resetUserPassword = useCallback((userId: string) => {
    axios
      .put<ResetPasswordInfo>(`/api/user/${userId}/password`)
      .then(({ data }) => setNewPasswordInfo(data))
      .catch(() => alert("Error reset password"));
  }, []);

  const deleteUser = useCallback(
    (userId: string) => {
      axios
        .delete(`/api/user/${userId}`)
        .then(searchUsers)
        .catch(() => alert("Error delete user"));
    },
    [searchUsers]
  );

  const upgradeUserRole = useCallback(
    (userId: string) => {
      axios
        .put(`/api/user/${userId}/role`, {
          role: Role.ADMIN,
        })
        .then(searchUsers)
        .catch(() => alert("Error upgrade role"));
    },
    [searchUsers]
  );

  useEffect(searchUsers, [searchUsers]);

  return (
    <DefaultLayout>
      <UsersTemplateSC>
        <UsersBoxSC>
          <h2 className="title">Liste des utilisateurs</h2>
          <ul>
            {currentUsers.map((user) => {
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
                          <Button
                            size="xs"
                            color="red"
                            onClick={() => deleteUser(user.id)}
                          >
                            Supprimer le compte
                          </Button>
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
        {/* <Modal
          opened={Boolean(newPasswordInfo)}
          onClose={() => setNewPasswordInfo(null)}
          title="Nouveau utilisateur"
          centered
        >
          <div>Utilisateur : {newPasswordInfo?.userName}</div>
          <div>Mot de passe temporaire: {newPasswordInfo?.newPassword}</div>
        </Modal> */}
      </UsersTemplateSC>
    </DefaultLayout>
  );
};
