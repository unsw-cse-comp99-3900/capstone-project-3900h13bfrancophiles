import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { Booking } from '@/types';

/**
 * Hook to fetch past bookings
 */
export default function usePastBookings(page: number, limit: number, type: string, sort: string) {
  const { data, isLoading, error } = useSWR<{ bookings: Booking[], total: number }>(`/bookings/past?page=${page}&limit=${limit}&type=${type}&sort=${sort}`, swrFetcher);

  return { pastBookings: data?.bookings, total: data?.total, isLoading, error };
}