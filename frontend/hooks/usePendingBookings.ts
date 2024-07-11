import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { Booking } from '@/types';

/**
 * Hook to fetch all pending bookings
 */
export default function usePendingBookings(page: number, limit: number, sort: string) {
  const { data, isLoading, error } = useSWR<{ bookings: Booking[], total: number }>(`/admin/bookings/pending?page=${page}&limit=${limit}&sort=${sort}`, swrFetcher);

  return { pastBookings: data?.bookings, total: data?.total, isLoading, error };
}