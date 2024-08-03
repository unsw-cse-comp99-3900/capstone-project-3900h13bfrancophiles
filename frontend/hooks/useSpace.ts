import useSWR from "swr";
import { swrFetcher } from "@/api";
import { Space, SpaceType } from "@/types";

/**
 * Hook to fetch details of a single space
 * @param spaceId ID of space
 */
export default function useSpace(spaceId: string) {
  const { data, isLoading, error } = useSWR<{ space: Space; type: SpaceType }>(
    `/spaces/${spaceId}`,
    swrFetcher,
  );

  return { space: data?.space, type: data?.type, isLoading, error };
}
