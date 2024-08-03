import useSWR from "swr";
import { swrFetcher } from "@/api";

/**
 * Hook to fetch whether the user can book this room
 * @param spaceId ID of space
 */
export default function useRoomCanBook(spaceId: string) {
  const { data, isLoading, error } = useSWR<{ canBook: boolean }>(
    `/bookable/${spaceId}`,
    swrFetcher,
  );

  return { canBook: data?.canBook, isLoading, error };
}
