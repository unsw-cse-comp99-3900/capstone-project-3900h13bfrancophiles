import useSWR from "swr";
import { swrFetcher } from "@/api";
import { BookingUser } from "@/types";

/**
 * Hook to fetch user details given zid
 */
export default function useUser(zid: number) {
  const { data, isLoading, error } = useSWR<{ user: BookingUser }>(`/users/${zid}`, swrFetcher);

  return { user: data?.user, isLoading, error };
}
