import { LoadingTemplate } from "@components/templates";
import { useCurrentUser } from "@hooks";
import { GetDisplayName } from "@utils/react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

export const redirectIfNotAdmin = (Page: NextPage) => {
  const RedirectIfNotAdmin: FC = () => {
    const router = useRouter();
    const { status } = useSession({
      required: false,
    });
    const { isAdmin } = useCurrentUser();

    useEffect(() => {
      if (!isAdmin || status === "unauthenticated") router.push("/");
    }, [isAdmin, router, status]);

    if (isAdmin) return <Page />;
    else return <LoadingTemplate />;
  };

  RedirectIfNotAdmin.displayName = `RedirectIfNotAdmin(${GetDisplayName(
    Page
  )})`;

  return RedirectIfNotAdmin;
};
