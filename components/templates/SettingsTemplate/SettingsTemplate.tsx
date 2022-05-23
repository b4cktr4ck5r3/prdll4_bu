import { SettingBoxSC } from "@components/atoms";
import { DefaultLayout } from "@components/layouts";
import {
  useHideWeekEnd,
  useSyncCalendarForm,
  useUserCalendarFilter,
} from "@hooks";
import { Button, PasswordInput, Select, Switch } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { styled } from "@stitches";
import { CalendarFilter } from "@utils/calendar/Calendar";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { FC } from "react";

export const SettingsTemplateSC = styled("div", {
  maxWidth: "420px",
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  gap: "$24",
});

export const SettingsTemplate: FC = () => {
  const { data } = useSession();
  const { hideWeekEnd, setHideWeekEnd } = useHideWeekEnd();
  const { syncCalendarForm, setSyncCalendarForm } = useSyncCalendarForm();
  const { userCalendarFilter, setUserCalendarFilter } = useUserCalendarFilter();

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
            checked={syncCalendarForm}
            onChange={(event) =>
              setSyncCalendarForm(
                event.currentTarget.checked ? "true" : "false"
              )
            }
          />
          <div className="sub-title">Calendrier</div>
          <Switch
            radius="md"
            label="Masquer les week-ends"
            checked={hideWeekEnd}
            onChange={(event) =>
              setHideWeekEnd(event.currentTarget.checked ? "true" : "false")
            }
          />
          <Switch
            radius="md"
            label="Activer la vue personnelle par défaut"
            checked={userCalendarFilter === CalendarFilter.PERSONAL}
            onChange={(event) =>
              setUserCalendarFilter(
                event.currentTarget.checked ? "personal" : "global"
              )
            }
          />
        </SettingBoxSC>
        <SettingBoxSC
          as="form"
          onSubmit={newPasswordForm.onSubmit((values) => {
            if (data?.user?.sub)
              axios
                .post(`/api/user/${data.user?.sub}/change_password`, {
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
                })
                .then(() => alert("Votre mot de passe a été modifié"))
                .catch(() => alert("Le mot de passe n'a pas pu être modifié"));
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
