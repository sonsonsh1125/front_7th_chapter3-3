import { useQuery } from "@tanstack/react-query"
import { fetchTags as fetchTagsApi } from "../api"
import { notifyError } from "../../../shared/lib/utils"

/**
 * 태그 목록 데이터 페칭 훅 (entities 레이어)
 */
export const useTagList = () => {
  const query = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsApi,
    staleTime: 1000 * 60,
    meta: {
      onError: (error: unknown) => notifyError("태그 목록을 불러오지 못했습니다.", error),
    },
  })

  return {
    tags: query.data || [],
    loading: query.isLoading || query.isFetching,
  }
}
