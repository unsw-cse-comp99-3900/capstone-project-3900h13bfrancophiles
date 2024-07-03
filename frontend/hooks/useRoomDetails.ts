import useSWR from 'swr';
import { swrFetcher } from '@/api';
import { Room } from '@/types';

/**
 * Hook to fetch all room details
 */
export default function useRoomDetails() {
  const { data, error } = useSWR<{ rooms: Room[] }>("/rooms", swrFetcher);

  return {
    roomsData: data?.rooms,
    isLoading: !error && !data,
    error,
  };
}