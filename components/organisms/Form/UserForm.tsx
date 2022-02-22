import { BasicForm } from "@components/molecules";
import { UserFormType, userInputs } from "@data/form/user";
import { Button } from "@mantine/core";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import axios from "axios";
import { FC, useMemo, useState } from "react";

export const UserForm: FC<{ onNew: () => void }> = ({ onNew }) => {
  const [form, setForm] = useState<UseForm<UserFormType>>();

  const formElement = useMemo(
    () => (
      <BasicForm
        {...userInputs()}
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
          .then((res) => alert(res.data.password))
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
