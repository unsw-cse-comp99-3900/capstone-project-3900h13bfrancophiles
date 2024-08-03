import useSWR from "swr";
import { swrFetcher } from "@/api";
import { BookingUser } from "@/types";

/**
 * Hook to fetch details of user
 * @param zid zID of user
 */
export default function useUser(zid: number) {
  const { data, isLoading, error } = useSWR<{ user: BookingUser }>(`/users/${zid}`, swrFetcher);

  return { user: data?.user, isLoading, error };
}
