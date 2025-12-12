import type { Tag } from "../model"

const API_BASE = import.meta.env.VITE_API_BASE || "/api"

/**
 * 태그 목록 조회
 */
export const fetchTags = async (): Promise<Tag[]> => {
  try {
    const response = await fetch(`${API_BASE}/posts/tags`)
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("태그 가져오기 오류:", error)
    throw error
  }
}
