import FetchUserRole from "@lib/swr/fetchers/FetchUserRole";
import { Role } from "@utils/user";
import { useMemo } from "react";
import useSWR from "swr";

export default function useAccountInfo() {
  const { data: role } = useSWR("user_role", FetchUserRole);
  const isAdmin = useMemo(() => role === Role.ADMIN, [role]);

  return {
    role,
    isAdmin,
  };
}
