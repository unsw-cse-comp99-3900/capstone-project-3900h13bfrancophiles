import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { AnonymousBooking } from '@/types';

/**
 * Hook to fetch availabilities for a space
 */
export default function useAvailabilities(spaceId: string) {
  const { data, isLoading, error } = useSWR<{ bookings: AnonymousBooking[] }>(`/availabilities/${spaceId}`, swrFetcher);

  return { bookings: data?.bookings, isLoading, error };
}