import { useState, useEffect } from "react"
import { DEFAULT_SORT_ORDER } from "../../../shared/config"

/**
 * 게시물 정렬 기능 훅
 */
export const usePostSort = (initialSortBy?: string, initialSortOrder?: string) => {
  const [sortBy, setSortBy] = useState<string>(initialSortBy || "")
  const [sortOrder, setSortOrder] = useState<string>(initialSortOrder || DEFAULT_SORT_ORDER)

  useEffect(() => {
    if (initialSortBy !== undefined) {
      setSortBy(initialSortBy)
    }
  }, [initialSortBy])

  useEffect(() => {
    if (initialSortOrder !== undefined) {
      setSortOrder(initialSortOrder)
    }
  }, [initialSortOrder])

  const updateSortBy = (value: string) => {
    setSortBy(value)
  }

  const updateSortOrder = (value: string) => {
    setSortOrder(value)
  }

  const getSortedPosts = (posts: any[]) => {
    if (!sortBy || sortBy === "none") {
      return posts
    }

    const sorted = [...posts].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "id":
          aValue = a.id
          bValue = b.id
          break
        case "title":
          aValue = a.title?.toLowerCase() || ""
          bValue = b.title?.toLowerCase() || ""
          break
        case "reactions":
          aValue = (a.reactions?.likes || 0) - (a.reactions?.dislikes || 0)
          bValue = (b.reactions?.likes || 0) - (b.reactions?.dislikes || 0)
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    return sorted
  }

  return {
    sortBy,
    sortOrder,
    updateSortBy,
    updateSortOrder,
    getSortedPosts,
  }
}

