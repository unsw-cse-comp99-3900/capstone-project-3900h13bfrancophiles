import useSWR from "swr";
import { swrFetcher } from "@/api";
import { Booking } from "@/types";

/**
 * Hook to fetch upcoming bookings
 * @param type filter by space type
 * @param sort sort the returns by time
 */
export default function useUpcomingBookings(type: string, sort: string) {
  const { data, isLoading, error, mutate } = useSWR<{ bookings: Booking[] }>(
    `/bookings/upcoming?type=${type}&sort=${sort}`,
    swrFetcher,
  );
  return { upcomingBookings: data?.bookings, isLoading, error, mutate };
}
