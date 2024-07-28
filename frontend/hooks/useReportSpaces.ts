import useSWR from "swr";
import { swrFetcher } from "@/api";
import { ReportSpace } from "@/types";

/**
 * Hook to fetch all available report spaces
 */
export default function useReportSpaces() {
  const { data, isLoading, error } = useSWR<{ spaces: ReportSpace[] }>(`/admin/reports/spaces`, swrFetcher);

  return { spaces: data?.spaces, isLoading, error };
}
