import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchComments as fetchCommentsApi } from "../api"
import { useCommentStore } from "./store"

/**
 * 댓글 목록 데이터 페칭 훅 (entities 레이어)
 */
export const useCommentList = (postId: number) => {
  const { comments, setComments } = useCommentStore()

  const query = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsApi(postId),
    staleTime: 1000 * 30,
  })

  useEffect(() => {
    if (query.data) {
      setComments(postId, query.data.comments)
    }
  }, [postId, query.data, setComments])

  return {
    comments: comments[postId] || [],
    isLoading: query.isLoading || query.isFetching,
  }
}
