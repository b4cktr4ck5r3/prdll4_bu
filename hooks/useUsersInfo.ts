import FetchUsers from "@lib/swr/fetchers/FetchUsers";
import useSWR from "swr";

export default function useUsersInfo() {
  const { data: users, mutate } = useSWR("UsersFull", () => FetchUsers());

  return {
    users: users || [],
    mutate,
  };
}
