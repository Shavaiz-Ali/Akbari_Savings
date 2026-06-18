// Shared query option defaults (mirrors QueryClient defaults but usable inline)
export const QUERY_OPTIONS = {
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  refetchOnMount: true,
} as const

// Factory: generates { all, lists, item } keys for a resource
function createQueryKeys(resource: string) {
  return {
    all: [resource] as const,
    lists: (params?: Record<string, unknown>) =>
      params ? ([resource, "list", params] as const) : ([resource, "list"] as const),
    item: (id?: string) =>
      id ? ([resource, "item", id] as const) : ([resource, "item"] as const),
  }
}

export const QUERY_KEYS = {
  members:  createQueryKeys("members"),
  deposits: createQueryKeys("deposits"),
  loans:    createQueryKeys("loans"),
  dashboard: createQueryKeys("dashboard"),
}
