import { LoadingTemplate } from "@components/templates";
import { Role } from "@utils/user";
import axios from "axios";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const redirectIfNotAdmin = (Page: NextPage) => {
  return () => {
    const router = useRouter();
    const { status } = useSession({
      required: false,
    });
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
      axios
        .get<{ role: Role }>("/api/user/role")
        .then(({ data }) => setIsAdmin(data.role === Role.ADMIN));
    }, []);

    useEffect(() => {
      if (isAdmin === false || status === "unauthenticated") router.push("/");
    }, [isAdmin, router, status]);

    if (isAdmin) return <Page />;
    else return <LoadingTemplate />;
  };
};
