import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { DeskPosition } from '@/types';

/**
 * Hook to fetch all desk positions
 */
export default function useSpaces() {
  const { data, isLoading, error } = useSWR<{ desks: DeskPosition[] }>(`/desks`, swrFetcher);

  return { desks: data?.desks, isLoading, error };
}
