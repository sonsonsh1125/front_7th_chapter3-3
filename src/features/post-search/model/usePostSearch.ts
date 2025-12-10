import { useState, useEffect } from "react"
import { searchPosts as searchPostsApi } from "../../../entities/post/api"
import { usePostStore } from "../../../entities/post/model"

/**
 * 게시물 검색 기능 훅
 */
export const usePostSearch = (initialQuery?: string) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery || "")
  const [isSearching, setIsSearching] = useState(false)
  const { setPosts, setTotal, setLoading } = usePostStore()

  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery)
    }
  }, [initialQuery])

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  const search = async () => {
    if (!searchQuery.trim()) {
      return
    }

    setIsSearching(true)
    setLoading(true)
    try {
      const data = await searchPostsApi(searchQuery)
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    } finally {
      setIsSearching(false)
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return {
    searchQuery,
    isSearching,
    updateSearchQuery,
    search,
    clearSearch,
  }
}

