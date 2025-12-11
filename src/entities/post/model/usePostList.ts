import { usePostStore } from "./store"
import { usePostsQuery, useSearchPostsQuery } from "./queries"
import type { Post } from "./types"
import type { PostsResponse } from "../api"

/**
 * 게시물 목록 데이터 페칭 훅 (entities 레이어)
 */
export const usePostList = (selectedTag?: string, searchQuery?: string) => {
  const { skip, limit } = usePostStore()
  const isSearching = !!searchQuery && searchQuery.trim().length > 0
  const listQuery = usePostsQuery({ skip, limit, tag: selectedTag })
  const searchQueryResult = useSearchPostsQuery(searchQuery || "", { enabled: isSearching })

  const listData = listQuery.data as { posts: Post[]; total: number } | undefined
  const searchData = searchQueryResult.data as PostsResponse | undefined

  return {
    posts: isSearching ? searchData?.posts || [] : listData?.posts || [],
    total: isSearching ? (searchData?.total ?? 0) : (listData?.total ?? 0),
    loading: isSearching
      ? searchQueryResult.isLoading || searchQueryResult.isFetching
      : listQuery.isLoading || listQuery.isFetching,
  }
}
