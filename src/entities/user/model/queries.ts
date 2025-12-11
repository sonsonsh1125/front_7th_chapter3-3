import { useQuery } from "@tanstack/react-query"
import { fetchUsers, fetchUserById } from "../api"
import { notifyError } from "../../../shared/lib/utils"

export const userQueryKeys = {
  all: ["users"] as const,
  list: (params: { limit?: number; select?: string }) => ["users", "list", params] as const,
  detail: (id: number) => ["users", "detail", id] as const,
}

export const useUsersQuery = (limit: number = 0, select?: string) => {
  return useQuery({
    queryKey: userQueryKeys.list({ limit, select: select || "" }),
    queryFn: () => fetchUsers(limit, select),
    staleTime: 1000 * 60,
    onError: (error) => notifyError("사용자 목록을 불러오지 못했습니다.", error),
  })
}

export const useUserQuery = (id?: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: id ? userQueryKeys.detail(id) : userQueryKeys.detail(0),
    queryFn: () => fetchUserById(id as number),
    enabled: options?.enabled ?? !!id,
    staleTime: 1000 * 60,
    onError: (error) => notifyError("사용자 정보를 불러오지 못했습니다.", error),
  })
}

