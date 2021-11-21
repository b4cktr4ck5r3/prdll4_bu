import { SettingBoxSC } from "@components/atoms";
import { DefaultLayout } from "@components/layouts";
import { Button, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { styled } from "@stitches";
import { Role } from "@utils/user";
import axios from "axios";
import { FC, Fragment, useCallback, useEffect, useState } from "react";

export const AdminHomeTemplateSC = styled("div", {
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  maxWidth: "$384",
  gap: "$24",
});

const TmpGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr auto",
  columnGap: "12px",
});

type TmpUser = {
  fullname: string;
  username: string;
  role: Role;
  password?: string;
};

export const AdminHomeTemplate: FC = () => {
  const [users, setUsers] = useState<TmpUser[]>([]);
  const [newUser, setNewUser] = useState<TmpUser | null>(null);

  const newUserForm = useForm<TmpUser>({
    initialValues: {
      fullname: "",
      username: "",
      role: Role.USER,
    },
    validationRules: {
      fullname: (value) => value.length > 0,
      username: (value) => value.length >= 6,
    },
  });
  const searchUsers = useCallback(async () => {
    return axios.get("/api/tmp/user/all").then(({ data }) => setUsers(data));
  }, []);

  useEffect(() => {
    searchUsers();
  }, [searchUsers]);

  return (
    <DefaultLayout mode={Role.ADMIN}>
      <AdminHomeTemplateSC>
        <SettingBoxSC>
          <div className="title">Utilisateurs</div>
          <TmpGrid>
            {["Nom d'utilisateur", "Nom Complet", "Role"].map((title) => (
              <div key={title}>{title}</div>
            ))}
            {users.map((user) => (
              <Fragment key={user.username}>
                <div>{user.username}</div>
                <div>{user.fullname}</div>
                <div>{user.role}</div>
              </Fragment>
            ))}
          </TmpGrid>
        </SettingBoxSC>
        {newUser ? (
          <SettingBoxSC>
            <div className="title">Nouvel utilisateur</div>
            <div className="sub-title">{"Nom d'utilisateur"}</div>
            <div style={{ marginTop: "4px", marginBottom: "8px" }}>
              {newUser.username}
            </div>
            <div className="sub-title">{"Nom complet"}</div>
            <div style={{ marginTop: "4px", marginBottom: "8px" }}>
              {newUser.fullname}
            </div>
            <div className="sub-title">{"Role"}</div>
            <div style={{ marginTop: "4px", marginBottom: "8px" }}>
              {newUser.role === Role.ADMIN ? "Administrateur" : "Utilisateur"}
            </div>
            <div className="sub-title">Mot de passe temporaire</div>
            <div style={{ marginTop: "4px", marginBottom: "8px" }}>
              {newUser.password}
            </div>
            <Button onClick={() => setNewUser(null)}>
              Créer un autre utilisateur
            </Button>
          </SettingBoxSC>
        ) : (
          <SettingBoxSC
            css={{ marginBottom: "$64" }}
            as="form"
            onSubmit={newUserForm.onSubmit((values) => {
              axios
                .post("/api/tmp/user/create", values)
                .then(({ data }) => setNewUser(data))
                .catch(() => alert("Erreur"))
                .finally(() => {
                  searchUsers();
                  newUserForm.reset();
                });
            })}
          >
            <div className="title">Créer un utilisateur</div>
            <TextInput
              placeholder="Nom d'utilisateur"
              label="Nom d'utilisateur"
              description="Minimum 6 caractères"
              error={newUserForm.errors.username}
              value={newUserForm.values.username}
              onChange={(e) =>
                newUserForm.setFieldValue("username", e.currentTarget.value)
              }
            />
            <TextInput
              placeholder="Nom complet"
              label="Nom complet"
              error={newUserForm.errors.fullname}
              value={newUserForm.values.fullname}
              onChange={(e) =>
                newUserForm.setFieldValue("fullname", e.currentTarget.value)
              }
            />
            <Select
              label="Role"
              data={[
                { value: Role.USER, label: "Utilisateur" },
                { value: Role.ADMIN, label: "Administrateur" },
              ]}
              error={newUserForm.errors.role}
              value={newUserForm.values.role}
              onChange={(value) =>
                newUserForm.setFieldValue("role", (value as Role) || Role.USER)
              }
            />
            <Button type="submit">Créer un nouvel utilisateur</Button>
          </SettingBoxSC>
        )}
      </AdminHomeTemplateSC>
    </DefaultLayout>
  );
};
