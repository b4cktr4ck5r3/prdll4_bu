import { Locked16, User16 } from "@carbon/icons-react";
import { BoxSC } from "@components/atoms";
import { Button, PasswordInput, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { styled } from "@stitches";
import {
  RedirectableProvider,
  signIn,
  SignInResponse,
  useSession,
} from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

export const LoginSC = styled("form", BoxSC);

export const Login: FC = () => {
  const router = useRouter();
  const { status } = useSession({ required: false });

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validationRules: {
      username: (value) => value.length > 0,
      password: (value) => value.length > 0,
    },
  });

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [router, status]);

  return (
    <LoginSC
      css={{ maxWidth: "$384", width: "100%" }}
      onSubmit={form.onSubmit((values) => {
        signIn<RedirectableProvider & SignInResponse>("credentials", {
          redirect: false,
          ...values,
        }).then((res) => {
          if (!res || res.error) alert(res?.error || "Erreur");
        });
      })}
    >
      <Title align="center">Connexion</Title>
      <TextInput
        icon={<User16 />}
        label="Nom d'utilisateur"
        mt="sm"
        placeholder="Entrez votre nom d'utilisateur"
        value={form.values.username}
        error={form.errors.username}
        onChange={(event) =>
          form.setFieldValue("username", event.currentTarget.value)
        }
      />
      <PasswordInput
        icon={<Locked16 />}
        label="Mot de passe"
        mt="sm"
        placeholder="Entrez votre mot de passe"
        value={form.values.password}
        error={form.errors.password}
        onChange={(event) =>
          form.setFieldValue("password", event.currentTarget.value)
        }
      />
      <Button type="submit" mt="md" color="blue" fullWidth>
        Connexion
      </Button>
    </LoginSC>
  );
};
