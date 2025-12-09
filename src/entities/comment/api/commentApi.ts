import type { Comment } from "../model"

/**
 * 댓글 목록 응답 타입
 */
export interface CommentsResponse {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

/**
 * 댓글 생성 요청 타입
 */
export interface CreateCommentRequest {
  body: string
  postId: number
  userId: number
}

/**
 * 댓글 업데이트 요청 타입
 */
export interface UpdateCommentRequest {
  body: string
}

/**
 * 댓글 좋아요 요청 타입
 */
export interface LikeCommentRequest {
  likes: number
}

/**
 * 게시물의 댓글 목록 조회
 */
export const fetchComments = async (postId: number): Promise<CommentsResponse> => {
  try {
    const response = await fetch(`/api/comments/post/${postId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("댓글 가져오기 오류:", error)
    throw error
  }
}

/**
 * 댓글 생성
 */
export const addComment = async (comment: CreateCommentRequest): Promise<Comment> => {
  try {
    const response = await fetch("/api/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    })
    if (!response.ok) {
      throw new Error(`Failed to add comment: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("댓글 추가 오류:", error)
    throw error
  }
}

/**
 * 댓글 업데이트
 */
export const updateComment = async (id: number, comment: UpdateCommentRequest): Promise<Comment> => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    })
    if (!response.ok) {
      throw new Error(`Failed to update comment: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("댓글 업데이트 오류:", error)
    throw error
  }
}

/**
 * 댓글 삭제
 */
export const deleteComment = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.statusText}`)
    }
  } catch (error) {
    console.error("댓글 삭제 오류:", error)
    throw error
  }
}

/**
 * 댓글 좋아요
 */
export const likeComment = async (id: number, likes: number): Promise<Comment> => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes }),
    })
    if (!response.ok) {
      throw new Error(`Failed to like comment: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("댓글 좋아요 오류:", error)
    throw error
  }
}

