/**
 * URL 파라미터를 관리하는 유틸리티 함수들
 */

export interface URLParams {
  skip?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: string
  tag?: string
}

/**
 * URLSearchParams에서 파라미터 값을 읽어오는 함수
 */
export const getURLParam = (searchParams: URLSearchParams, key: string, defaultValue: string = ""): string => {
  return searchParams.get(key) || defaultValue
}

/**
 * URLSearchParams에서 숫자 파라미터를 읽어오는 함수
 */
export const getURLNumberParam = (searchParams: URLSearchParams, key: string, defaultValue: number = 0): number => {
  const value = searchParams.get(key)
  return value ? parseInt(value, 10) : defaultValue
}

/**
 * 객체를 URL 쿼리 문자열로 변환하는 함수
 */
export const buildQueryString = (params: URLParams): string => {
  const urlParams = new URLSearchParams()
  
  if (params.skip !== undefined && params.skip > 0) {
    urlParams.set("skip", params.skip.toString())
  }
  if (params.limit !== undefined && params.limit > 0) {
    urlParams.set("limit", params.limit.toString())
  }
  if (params.search) {
    urlParams.set("search", params.search)
  }
  if (params.sortBy) {
    urlParams.set("sortBy", params.sortBy)
  }
  if (params.sortOrder) {
    urlParams.set("sortOrder", params.sortOrder)
  }
  if (params.tag) {
    urlParams.set("tag", params.tag)
  }
  
  return urlParams.toString()
}

