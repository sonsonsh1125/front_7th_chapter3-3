import type { User } from "../model"

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
    let url = `/api/users?limit=${limit}`
    if (select) {
      url += `&select=${encodeURIComponent(select)}`
    }
    const response = await fetch(url)
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
    const response = await fetch(`/api/users/${id}`)
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

