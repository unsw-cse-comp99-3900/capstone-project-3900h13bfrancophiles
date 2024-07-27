import useSWR from "swr";
import { swrFetcher } from "@/api";
import { Booking } from "@/types";

/**
 * Hook to fetch overlapping bookings
 */
export default function useOverlappingBookings(bookingId: number) {
  const { data, isLoading, error } = useSWR<{ bookings: Booking[] }>(
    `/admin/bookings/overlapping/${bookingId}`,
    swrFetcher,
  );

  return { bookings: data?.bookings, isLoading, error };
}
