import { SettingBoxSC } from "@components/atoms";
import { DefaultLayout } from "@components/layouts";
import { Button, PasswordInput, Select, Switch } from "@mantine/core";
import { useForm, useLocalStorageValue } from "@mantine/hooks";
import { styled } from "@stitches";
import { BooleanString, Preferences } from "@utils/user";
import axios from "axios";
import type { FC } from "react";

export const SettingsTemplateSC = styled("div", {
  maxWidth: "420px",
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  gap: "$24",
});

export const SettingsTemplate: FC = () => {
  const [syncCalendarForm, setSyncCalendarForm] =
    useLocalStorageValue<BooleanString>({
      key: Preferences.SyncCalendarForm,
      defaultValue: "false",
    });

  const newPasswordForm = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationRules: {
      currentPassword: (value) => value.length > 0,
      newPassword: (value) => value.length >= 6,
      confirmNewPassword: (value, values) => value === values?.newPassword,
    },
  });

  return (
    <DefaultLayout>
      <SettingsTemplateSC>
        <SettingBoxSC>
          <div className="title">Interface</div>
          <div className="sub-title">Langue</div>
          <Select
            data={[{ value: "fr", label: "Français" }]}
            value="fr"
            disabled
          />

          <div className="sub-title">Travaux internes - Indisponibilités</div>
          <Switch
            radius="md"
            label="Synchroniser la date du calendrier et du formulaire"
            checked={syncCalendarForm === "true"}
            onChange={(event) =>
              setSyncCalendarForm(
                event.currentTarget.checked ? "true" : "false"
              )
            }
          />
          <div className="sub-title">Calendrier</div>
          <Switch
            disabled
            radius="md"
            label="Masquer les week-ends (à venir)"
            checked={false}
          />
        </SettingBoxSC>
        <SettingBoxSC
          as="form"
          onSubmit={newPasswordForm.onSubmit((values) => {
            axios.put("api/user/password", {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            });
            newPasswordForm.reset();
          })}
        >
          <div className="title">Changer de mot de passe</div>
          <PasswordInput
            required
            placeholder="Mot de passe actuel"
            label="Mot de passe actuel"
            error={newPasswordForm.errors.currentPassword}
            value={newPasswordForm.values.currentPassword}
            onChange={(e) =>
              newPasswordForm.setFieldValue(
                "currentPassword",
                e.currentTarget.value
              )
            }
          />
          <PasswordInput
            required
            placeholder="Nouveau mot de passe"
            label="Nouveau mot de passe"
            description="Minimum 6 caractères"
            error={newPasswordForm.errors.newPassword}
            value={newPasswordForm.values.newPassword}
            onChange={(e) =>
              newPasswordForm.setFieldValue(
                "newPassword",
                e.currentTarget.value
              )
            }
          />
          <PasswordInput
            required
            placeholder="Confirmation du nouveau mot de passe"
            label="Confirmation du nouveau mot de passe"
            error={newPasswordForm.errors.confirmNewPassword}
            value={newPasswordForm.values.confirmNewPassword}
            onChange={(e) =>
              newPasswordForm.setFieldValue(
                "confirmNewPassword",
                e.currentTarget.value
              )
            }
          />
          <Button type="submit" color="green">
            Changer de mot de passe
          </Button>
        </SettingBoxSC>
      </SettingsTemplateSC>
    </DefaultLayout>
  );
};
