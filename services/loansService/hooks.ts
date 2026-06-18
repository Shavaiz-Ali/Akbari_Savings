import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queryConfig"
import { loanService, LoanParams } from "./api"

export function useLoans(params: LoanParams) {
  return useQuery({
    queryKey: QUERY_KEYS.loans.lists(params as Record<string, unknown>),
    queryFn: () => loanService.getLoans(params),
    enabled: false, // loans module is disabled — do not fetch yet
  })
}
