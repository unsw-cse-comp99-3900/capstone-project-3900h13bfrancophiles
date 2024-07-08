import useSWR from 'swr';
import { swrFetcher } from '@/api';

type SpacesRes = {
  spaces: { id: string; name: string; isRoom: boolean }[]
};

/**
 * Hook to fetch all spaces
 */
export default function useSpaces() {
  const { data, isLoading, error } = useSWR<SpacesRes>(`/spaces`, swrFetcher);

  return { spaces: data?.spaces, isLoading, error };
}