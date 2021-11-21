import { LoadingTemplate } from "@components/templates";
import { GetDisplayName } from "@utils/react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

export type ProtectedPageProps = {
  active: boolean;
};

export const redirectIfUnauthenticated = (Page: NextPage) => {
  const RedirectIfUnauthenticated: FC = () => {
    const router = useRouter();
    const { status } = useSession({
      required: false,
    });

    useEffect(() => {
      if (status === "unauthenticated") router.push("/login");
    }, [router, status]);

    if (status === "authenticated") return <Page />;
    else return <LoadingTemplate />;
  };

  RedirectIfUnauthenticated.displayName = `RedirectIfUnauthenticated(${GetDisplayName(
    Page
  )})`;

  return RedirectIfUnauthenticated;
};
