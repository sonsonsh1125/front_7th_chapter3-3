import { useEffect } from "react"
import { fetchComments as fetchCommentsApi } from "../api"
import { useCommentStore } from "./store"

/**
 * 댓글 목록 데이터 페칭 훅 (entities 레이어)
 */
export const useCommentList = (postId: number) => {
  const { comments, setComments } = useCommentStore()

  useEffect(() => {
    const fetchComments = async () => {
      if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
      try {
        const data = await fetchCommentsApi(postId)
        setComments(postId, data.comments)
      } catch (error) {
        console.error("댓글 가져오기 오류:", error)
      }
    }
    fetchComments()
  }, [postId, comments, setComments])

  return {
    comments: comments[postId] || [],
  }
}

