import { FetchUser } from "@lib/swr/fetchers";
import { Role } from "@utils/user";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import useSWR from "swr";

export function useCurrentUser() {
  const { data: sessionData } = useSession();

  const { data: user } = useSWR("current_user", () =>
    FetchUser(sessionData?.user?.sub)
  );
  const isAdmin = useMemo(() => user?.role === Role.ADMIN, [user]);

  return {
    user,
    isAdmin,
  };
}
