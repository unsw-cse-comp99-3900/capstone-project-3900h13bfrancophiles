import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { Booking } from '@/types';

/**
 * Hook to fetch current bookings
 */
export default function useCurrentBookings() {
  const { data, isLoading, error } = useSWR<{ bookings: Booking[] }>("/bookings/current", swrFetcher);

  return { currentBookings: data?.bookings, isLoading, error };
}