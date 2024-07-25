import useSWR from "swr";
import { swrFetcher } from "@/api";
import { SpaceOption } from "@/types";

/**
 * Hook to fetch all spaces
 */
export default function useSpaces() {
  const { data, isLoading, error } = useSWR<{ spaces: SpaceOption[] }>(`/spaces`, swrFetcher);

  return { spaces: data?.spaces, isLoading, error };
}
