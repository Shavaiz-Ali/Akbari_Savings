import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { QUERY_KEYS } from "@/lib/queryConfig"
import { depositService, DepositParams } from "./api"

export function useDeposits(params: DepositParams) {
  return useQuery({
    queryKey: QUERY_KEYS.deposits.lists(params as Record<string, unknown>),
    queryFn: () => depositService.getDeposits(params),
  })
}

export function useApproveDeposit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => depositService.approveDeposit(id),
    onSuccess: () => {
      toast.success("Deposit approved")
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deposits.all })
    },
    onError: (error: any) => {
      const msg = error?.error || error?.message || "Something went wrong"
      toast.error(msg)
    },
  })
}

export function useRejectDeposit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => depositService.rejectDeposit(id),
    onSuccess: () => {
      toast.error("Deposit rejected")
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deposits.all })
    },
    onError: (error: any) => {
      const msg = error?.error || error?.message || "Something went wrong"
      toast.error(msg)
    },
  })
}
