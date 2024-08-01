import useSWR from "swr";
import { swrFetcher } from "@/api";
import { AnonymousBooking } from "@/types";

/**
 * Hook to fetch availabilities for a space
 */
export default function useAvailabilities(spaceId: string, starttime : string = "", endtime : string = "") {
  const url = `/availabilities/${spaceId}?` + ((starttime && endtime) ? new URLSearchParams({
    datetimeStart: starttime,
    datetimeEnd: endtime,
  }) : "")
  const { data, isLoading, error, mutate } = useSWR<{ bookings: AnonymousBooking[] }>(
    url,
    swrFetcher,
  );

  return { bookings: data?.bookings, isLoading, error, mutate };
}
