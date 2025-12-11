import { useState, useEffect } from "react"

/**
 * 게시물 검색 기능 훅
 */
export const usePostSearch = (initialQuery?: string) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery || "")

  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery)
    }
  }, [initialQuery])

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  const search = async () => {
    // 쿼리는 usePostList에서 처리하므로 여기서는 검색어만 관리
    return
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return {
    searchQuery,
    isSearching: false,
    updateSearchQuery,
    search,
    clearSearch,
  }
}

