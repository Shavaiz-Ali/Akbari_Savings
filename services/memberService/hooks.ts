import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { QUERY_KEYS } from "@/lib/queryConfig"
import { memberService, MemberParams, CreateMemberData, UpdateMemberData } from "./api"

export function useActiveMembers() {
  return useQuery({
    queryKey: QUERY_KEYS.members.lists({ status: "active" }),
    queryFn: () => memberService.getMembers({ status: "active" }),
  })
}

export function usePendingMembers() {
  return useQuery({
    queryKey: QUERY_KEYS.members.lists({ status: "pending" }),
    queryFn: () => memberService.getMembers({ status: "pending" }),
  })
}

export function useCreateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMemberData) => memberService.createMember(data),
    onSuccess: () => {
      toast.success("Member created successfully")
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members.all })
    },
    onError: (error: any) => {
      const msg = error?.error || error?.message || "Something went wrong"
      toast.error(msg)
    },
  })
}

export function useUpdateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberData }) =>
      memberService.updateMember(id, data),
    onSuccess: () => {
      toast.success("Member updated")
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members.all })
    },
    onError: (error: any) => {
      const msg = error?.error || error?.message || "Something went wrong"
      toast.error(msg)
    },
  })
}

export function useDeactivateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => memberService.deleteMember(id),
    onSuccess: () => {
      toast.warning("Member deactivated")
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members.all })
    },
    onError: (error: any) => {
      const msg = error?.error || error?.message || "Something went wrong"
      toast.error(msg)
    },
  })
}

export function useApproveMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => memberService.approveMember(id),
    onSuccess: () => {
      toast.success("Member approved")
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members.all })
    },
    onError: (error: any) => {
      const msg = error?.error || error?.message || "Something went wrong"
      toast.error(msg)
    },
  })
}

export function useRejectMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => memberService.rejectMember(id),
    onSuccess: () => {
      toast.error("Signup request rejected")
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members.all })
    },
    onError: (error: any) => {
      const msg = error?.error || error?.message || "Something went wrong"
      toast.error(msg)
    },
  })
}
