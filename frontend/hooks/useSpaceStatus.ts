import useSWR from "swr";
import { swrFetcher } from "@/api";
import { StatusResponse } from "@/types";

/**
 * Hook to fetch room status for a specific datetime range
 * @param datetimeStart start of time range (inclusive)
 * @param datetimeEnd end of time range (inclusive)
 */
export default function useSpaceStatus(datetimeStart: string, datetimeEnd: string) {
  const { data, isLoading, error } = useSWR<StatusResponse>(
    `/status?datetimeStart=${datetimeStart}&datetimeEnd=${datetimeEnd}`,
    swrFetcher,
  );

  return { statusResponse: data, isLoading, error };
}
