import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { Space } from '@/types';

/**
 * Hook to fetch current bookings
 */
export default function useSpace(spaceId: string) {
  const { data, isLoading, error } = useSWR<{ space: Space }>(`/spaces/${spaceId}`, swrFetcher);

  return { space: data?.space, isLoading, error };
}