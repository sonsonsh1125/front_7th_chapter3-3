import type { Post } from "../model"

/**
 * 게시물 목록 응답 타입
 */
export interface PostsResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

/**
 * 게시물 생성 요청 타입
 */
export interface CreatePostRequest {
  title: string
  body: string
  userId: number
}

/**
 * 게시물 업데이트 요청 타입
 */
export interface UpdatePostRequest {
  title?: string
  body?: string
  userId?: number
  tags?: string[]
}

/**
 * 게시물 목록 조회
 */
export const fetchPosts = async (limit: number, skip: number): Promise<PostsResponse> => {
  try {
    const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("게시물 가져오기 오류:", error)
    throw error
  }
}

/**
 * 게시물 검색
 */
export const searchPosts = async (query: string): Promise<PostsResponse> => {
  try {
    const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error(`Failed to search posts: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("게시물 검색 오류:", error)
    throw error
  }
}

/**
 * 태그별 게시물 조회
 */
export const fetchPostsByTag = async (tag: string): Promise<PostsResponse> => {
  try {
    const response = await fetch(`/api/posts/tag/${encodeURIComponent(tag)}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch posts by tag: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("태그별 게시물 가져오기 오류:", error)
    throw error
  }
}

/**
 * 게시물 생성
 */
export const addPost = async (post: CreatePostRequest): Promise<Post> => {
  try {
    const response = await fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
    if (!response.ok) {
      throw new Error(`Failed to add post: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("게시물 추가 오류:", error)
    throw error
  }
}

/**
 * 게시물 업데이트
 */
export const updatePost = async (id: number, post: UpdatePostRequest): Promise<Post> => {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("게시물 업데이트 오류:", error)
    throw error
  }
}

/**
 * 게시물 삭제
 */
export const deletePost = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.statusText}`)
    }
  } catch (error) {
    console.error("게시물 삭제 오류:", error)
    throw error
  }
}

