import { LoadingTemplate } from "@components/templates";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const redirectIfAuthenticated = (Page: NextPage) => {
  return () => {
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
};
