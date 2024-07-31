import useSWR from "swr";
import { swrFetcher } from "@/api";
import { ReportTypeReturn } from "@/types";

/**
 * Hook to fetch all available report types
 */
export default function useReportTypes() {
  const { data, isLoading, error } = useSWR<ReportTypeReturn>(`/admin/reports/types`, swrFetcher);

  return { types: data?.types, isLoading, error };
}
