import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { Booking } from '@/types';

/**
 * Hook to fetch past bookings
 */
export default function usePastBookings(page: number, limit: number) {
  const { data, isLoading, error } = useSWR<{ bookings: Booking[], total: number }>(`/bookings/past?page=${page}&limit=${limit}`, swrFetcher);

  return { pastBookings: data?.bookings, total: data?.total, isLoading, error };
}