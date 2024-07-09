import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { Space } from '@/types';

/**
 * Hook to fetch details of a single space
 */
export default function useSpace(spaceId: string) {
  const { data, isLoading, error } = useSWR<{ space: Space }>(`/spaces/${spaceId}`, swrFetcher);

  return { space: data?.space, isLoading, error };
}