import { useState, useEffect } from "react"
import { fetchTags as fetchTagsApi } from "../api"
import type { Tag } from "./types"

/**
 * 태그 목록 데이터 페칭 훅 (entities 레이어)
 */
export const useTagList = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true)
      try {
        const data = await fetchTagsApi()
        setTags(data)
      } catch (error) {
        console.error("태그 가져오기 오류:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTags()
  }, [])

  return {
    tags,
    loading,
  }
}

