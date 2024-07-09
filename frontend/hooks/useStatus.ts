import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { Booking, Status } from '@/types';

/**
 * Hook to fetch statuses // currently not working?
 */
export default function useStatus(start: string, end: string) {
    const { data, isLoading, error } = useSWR<{[spaceId: string]: Status}>(`/status?datetimeStart=${start}&datetimeEnd=${end}`, swrFetcher);
    return { data, isLoading, error };
  }