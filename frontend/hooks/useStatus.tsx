import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { Status } from '@/types';

/**
 * Hook to fetch statuses
 */
export default function useStatus(start: string, end: string) {
  const { data, isLoading, error } = useSWR<{ [spaceId: string]: Status }>(`/status?datetimeStart=${start}&datetimeEnd=${end}`, swrFetcher);
  return { data, isLoading, error };
}