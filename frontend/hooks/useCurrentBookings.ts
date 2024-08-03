import useSWR from "swr";
import { swrFetcher } from "@/api";
import { Booking } from "@/types";

/**
 * Hook to fetch the user's current bookings
 */
export default function useCurrentBookings() {
  const { data, mutate, isLoading, error } = useSWR<{ bookings: Booking[] }>(
    "/bookings/current",
    swrFetcher,
  );

  return { currentBookings: data?.bookings, isLoading, error, mutate };
}
