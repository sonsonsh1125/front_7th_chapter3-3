import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPosts, fetchPostsByTag, searchPosts, addPost, updatePost, deletePost } from "../api"
import { fetchUsers } from "../../user/api"
import { notifyError } from "../../../shared/lib/utils"
import type { CreatePostRequest, UpdatePostRequest, PostsResponse } from "../api"
import type { Post } from "./types"

export const postsQueryKeys = {
  all: ["posts"] as const,
  list: (params: { skip: number; limit: number; tag?: string | null }) => ["posts", "list", params] as const,
  search: (query: string) => ["posts", "search", query] as const,
}

const attachUsers = (postsData: PostsResponse, users: Awaited<ReturnType<typeof fetchUsers>>): Post[] => {
  return postsData.posts.map((post) => ({
    ...post,
    author: users.users.find((user) => user.id === post.userId),
  }))
}

export const usePostsQuery = (params: { skip: number; limit: number; tag?: string | null }) => {
  const { skip, limit, tag } = params
  return useQuery<{ posts: Post[]; total: number }>({
    queryKey: postsQueryKeys.list({ skip, limit, tag }),
    queryFn: async () => {
      if (tag && tag !== "all") {
        const [postsData, users] = await Promise.all([fetchPostsByTag(tag), fetchUsers(0, "username,image")])
        return { posts: attachUsers(postsData, users), total: postsData.total }
      }
      const [postsData, users] = await Promise.all([fetchPosts(limit, skip), fetchUsers(0, "username,image")])
      return { posts: attachUsers(postsData, users), total: postsData.total }
    },
    placeholderData: (prev) => prev,
    onError: (error) => notifyError("게시물 목록을 불러오지 못했습니다.", error),
  })
}

export const useSearchPostsQuery = (query: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: postsQueryKeys.search(query),
    queryFn: async () => {
      const data = await searchPosts(query)
      return data
    },
    enabled: options?.enabled ?? !!query,
    staleTime: 1000 * 30,
    onError: (error) => notifyError("게시물 검색에 실패했습니다.", error),
  })
}

export const useAddPostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePostRequest) => addPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.all })
    },
    onError: (error) => notifyError("게시물 생성에 실패했습니다.", error),
  })
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) => updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.all })
    },
    onError: (error) => notifyError("게시물 수정에 실패했습니다.", error),
  })
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.all })
    },
    onError: (error) => notifyError("게시물 삭제에 실패했습니다.", error),
  })
}

