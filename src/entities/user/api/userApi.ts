import type { User } from "../model"

const API_BASE = import.meta.env.VITE_API_BASE || "/api"

/**
 * 사용자 목록 응답 타입
 */
export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

/**
 * 사용자 목록 조회
 * @param limit - 조회할 사용자 수
 * @param select - 조회할 필드 선택 (예: "username,image")
 */
export const fetchUsers = async (limit: number = 0, select?: string): Promise<UsersResponse> => {
  try {
    const params = new URLSearchParams()
    params.set("limit", String(limit))
    if (select) params.set("select", select)
    const response = await fetch(`${API_BASE}/users?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("사용자 가져오기 오류:", error)
    throw error
  }
}

/**
 * 사용자 ID로 조회
 */
export const fetchUserById = async (id: number): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE}/users/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("사용자 정보 가져오기 오류:", error)
    throw error
  }
}
