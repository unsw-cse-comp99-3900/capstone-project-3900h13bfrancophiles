import useSWR from 'swr';
import { swrFetcher } from '@/api';
import {Space, SpaceType, UserGroup} from '@/types';

/**
 * Hook to fetch the minimum required group to book a space
 */
export default function useRoomMinReq(spaceId: string) {
  const { data, isLoading, error } = useSWR<{ minReqGrp: UserGroup }>(`/minReqGrp/${spaceId}`, swrFetcher);

  return { minReqGrp: data?.minReqGrp , isLoading, error };
}