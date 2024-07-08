import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { Booking } from '@/types';

/**
 * Hook to fetch upcoming bookings
 */
export default function useUpcomingBookings() {
  const { data, isLoading, error, mutate } = useSWR<{ bookings: Booking[] }>("/bookings/upcoming/", swrFetcher);

  return { upcomingBookings: data?.bookings, isLoading, error, mutate };
}