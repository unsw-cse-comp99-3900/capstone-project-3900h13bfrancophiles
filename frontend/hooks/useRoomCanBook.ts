import useSWR from 'swr';
import { swrFetcher } from '@/api';

/**
 * Hook to fetch the minimum required group to book a space
 */
export default function useRoomRoomCanBook(spaceId: string) {
  const { data, isLoading, error } = useSWR<{ canBook: boolean }>(`/bookable/${spaceId}`, swrFetcher);

  return { canBook: data?.canBook , isLoading, error };
}