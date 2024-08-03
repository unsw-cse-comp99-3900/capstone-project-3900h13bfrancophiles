import useSWR from "swr";
import { swrFetcher } from "@/api";
import { Booking } from "@/types";

/**
 * Hook to fetch overlapping bookings
 * @param bookingId ID of booking to fetch overlaps of
 */
export default function useOverlappingBookings(bookingId: number) {
  const { data, mutate, isLoading, error } = useSWR<{ bookings: Booking[] }>(
    `/admin/bookings/overlapping/${bookingId}`,
    swrFetcher,
  );

  return { overlappingBookings: data?.bookings, isLoading, error, mutate };
}
