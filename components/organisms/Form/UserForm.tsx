import { BasicForm } from "@components/molecules";
import { UserFormType, userInputs } from "@data/form/user";
import { Button } from "@mantine/core";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useModals } from "@mantine/modals";
import { Role } from "@utils/user";
import axios from "axios";
import { FC, useMemo, useState } from "react";

export const UserForm: FC<{ onNew: () => void }> = ({ onNew }) => {
  const [form, setForm] = useState<UseForm<UserFormType>>();
  const modals = useModals();

  const formElement = useMemo(
    () => (
      <BasicForm
        {...userInputs()}
        listData={{
          role: [
            {
              label: "Utilisateur",
              value: Role.USER,
            },
            {
              label: "Administrateur",
              value: Role.ADMIN,
            },
          ],
        }}
        setForm={(form: UseForm<UserFormType>) => setForm(form)}
      />
    ),
    []
  );

  return (
    <form
      onSubmit={form?.onSubmit((data) =>
        axios
          .post("/api/user", data)
          .then((res) =>
            modals.openModal({
              title: "Nouvel utilisateur",
              children: (
                <>
                  <div>Utilisateur : {data.username}</div>
                  <div>Mot de passe temporaire: {res.data.password}</div>
                </>
              ),
            })
          )
          .then(onNew)
      )}
    >
      {formElement}
      <Button mt="sm" type="submit">
        {"Créer l'utilisateur"}
      </Button>
    </form>
  );
};
