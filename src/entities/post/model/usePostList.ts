import { useEffect, useCallback } from "react"
import { fetchPosts as fetchPostsApi, fetchPostsByTag as fetchPostsByTagApi } from "../api"
import { fetchUsers } from "../../user/api"
import { usePostStore } from "./store"

/**
 * 게시물 목록 데이터 페칭 훅 (entities 레이어)
 */
export const usePostList = (selectedTag?: string) => {
  const { posts, loading, skip, limit, setPosts, setTotal, setLoading } = usePostStore()

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([fetchPostsApi(limit, skip), fetchUsers(0, "username,image")])
      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [limit, skip, setLoading, setPosts, setTotal])

  const fetchPostsByTag = useCallback(
    async (tag: string) => {
      if (!tag || tag === "all") {
        fetchPosts()
        return
      }
      setLoading(true)
      try {
        const [postsData, usersData] = await Promise.all([fetchPostsByTagApi(tag), fetchUsers(0, "username,image")])

        const postsWithUsers = postsData.posts.map((post) => ({
          ...post,
          author: usersData.users.find((user) => user.id === post.userId),
        }))

        setPosts(postsWithUsers)
        setTotal(postsData.total)
      } catch (error) {
        console.error("태그별 게시물 가져오기 오류:", error)
      } finally {
        setLoading(false)
      }
    },
    [fetchPosts, setLoading, setPosts, setTotal]
  )

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
  }, [skip, limit, selectedTag, fetchPosts, fetchPostsByTag])

  return {
    posts,
    loading,
  }
}

