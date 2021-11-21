import { LoadingTemplate } from "@components/templates";
import { GetDisplayName } from "@utils/react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

export const redirectIfAuthenticated = (Page: NextPage) => {
  const RedirectIfAuthenticated: FC = () => {
    const router = useRouter();
    const { status } = useSession({
      required: false,
    });

    useEffect(() => {
      if (status === "authenticated") router.push("/");
    }, [router, status]);

    if (status === "unauthenticated") return <Page />;
    else return <LoadingTemplate />;
  };

  RedirectIfAuthenticated.displayName = `RedirectIfAuthenticated(${GetDisplayName(
    Page
  )})`;

  return RedirectIfAuthenticated;
};
