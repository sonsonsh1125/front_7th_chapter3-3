import { useEffect, useState } from "react"
import { Edit2, MessageSquare, Plus, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shared/ui"
import { highlightText, buildQueryString, getURLParam, getURLNumberParam } from "../shared/lib/utils"
import { DEFAULT_LIMIT, DEFAULT_SKIP, DEFAULT_SORT_ORDER } from "../shared/config"
import { fetchPosts as fetchPostsApi, fetchPostsByTag as fetchPostsByTagApi } from "../entities/post/api"
import { fetchComments as fetchCommentsApi } from "../entities/comment/api"
import { fetchUsers } from "../entities/user/api"
import { fetchTags as fetchTagsApi } from "../entities/tag/api"
import { usePostStore } from "../entities/post/model"
import { useCommentStore } from "../entities/comment/model"
import { PostCreateDialog } from "../features/post-create"
import { PostEditDialog, usePostEdit } from "../features/post-edit"
import { usePostDelete } from "../features/post-delete"
import { PostSearchInput, usePostSearch } from "../features/post-search"
import { PostSortSelect, usePostSort } from "../features/post-sort"
import { CommentCreateDialog, useCommentCreate } from "../features/comment-create"
import { CommentEditDialog, useCommentEdit } from "../features/comment-edit"
import { useCommentDelete } from "../features/comment-delete"
import { useCommentLike } from "../features/comment-like"
import { UserModal, useUserView } from "../features/user-view"
import type { Post } from "../entities/post/model"
import type { Tag } from "../entities/tag/model"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // Zustand 스토어
  const { posts, total, loading, skip, limit, setPosts, setTotal, setLoading, setSkip, setLimit } = usePostStore()

  const { comments, setComments } = useCommentStore()

  // Features 훅
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const postEdit = usePostEdit(showEditDialog, setShowEditDialog)
  const postDelete = usePostDelete()
  const searchQuery = getURLParam(queryParams, "search")
  const postSearch = usePostSearch(searchQuery)
  const sortBy = getURLParam(queryParams, "sortBy")
  const sortOrder = getURLParam(queryParams, "sortOrder", DEFAULT_SORT_ORDER)
  const postSort = usePostSort(sortBy, sortOrder)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const commentCreate = useCommentCreate(showAddCommentDialog, setShowAddCommentDialog)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const commentEdit = useCommentEdit(showEditCommentDialog, setShowEditCommentDialog)
  const commentDelete = useCommentDelete()
  const commentLike = useCommentLike()
  const [showUserModal, setShowUserModal] = useState(false)
  const userView = useUserView(showUserModal, setShowUserModal)

  // 로컬 UI 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTag, setSelectedTag] = useState(getURLParam(queryParams, "tag"))
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)

  // skip, limit 초기화 (URL에서 읽어오기)
  useEffect(() => {
    const urlSkip = getURLNumberParam(queryParams, "skip", DEFAULT_SKIP)
    const urlLimit = getURLNumberParam(queryParams, "limit", DEFAULT_LIMIT)
    if (urlSkip !== skip) setSkip(urlSkip)
    if (urlLimit !== limit) setLimit(urlLimit)
  }, [])

  // URL 업데이트 함수
  const updateURL = () => {
    const queryString = buildQueryString({
      skip: skip,
      limit: limit,
      search: postSearch.searchQuery,
      sortBy: postSort.sortBy,
      sortOrder: postSort.sortOrder,
      tag: selectedTag,
    })
    navigate(`?${queryString}`)
  }

  // 게시물 가져오기
  const fetchPosts = async () => {
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
  }

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const data = await fetchTagsApi()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 게시물 검색은 usePostSearch 훅에서 처리

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
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
  }

  // 게시물 추가/수정/삭제는 features에서 처리

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const data = await fetchCommentsApi(postId)
      setComments(postId, data.comments)
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가/수정/삭제/좋아요는 features에서 처리

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기는 useUserView 훅에서 처리

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, postSort.sortBy, postSort.sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(getURLNumberParam(params, "skip", DEFAULT_SKIP))
    setLimit(getURLNumberParam(params, "limit", DEFAULT_LIMIT))
    postSearch.updateSearchQuery(getURLParam(params, "search"))
    postSort.updateSortBy(getURLParam(params, "sortBy"))
    postSort.updateSortOrder(getURLParam(params, "sortOrder", DEFAULT_SORT_ORDER))
    setSelectedTag(getURLParam(params, "tag"))
  }, [location.search, setSkip, setLimit])

  // 게시물 테이블 렌더링
  const renderPostTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, postSearch.searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSelectedTag(tag)
                        updateURL()
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => post.author && userView.openModal(post.author)}
              >
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    postEdit.openDialog(post)
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => postDelete.deletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            commentCreate.openDialog(postId)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, postSearch.searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => commentLike.likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  commentEdit.openDialog(comment)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => commentDelete.deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <PostSearchInput initialQuery={searchQuery} />
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
                fetchPostsByTag(value)
                updateURL()
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <PostSortSelect initialSortBy={sortBy} initialSortOrder={sortOrder} />
          </div>

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
                이전
              </Button>
              <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostCreateDialog isOpen={showAddDialog} onOpenChange={setShowAddDialog} />

      {/* 게시물 수정 대화상자 */}
      <PostEditDialog isOpen={showEditDialog} onOpenChange={setShowEditDialog} />

      {/* 댓글 추가 대화상자 */}
      <CommentCreateDialog isOpen={showAddCommentDialog} onOpenChange={setShowAddCommentDialog} />

      {/* 댓글 수정 대화상자 */}
      <CommentEditDialog isOpen={showEditCommentDialog} onOpenChange={setShowEditCommentDialog} />

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title || "", postSearch.searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body || "", postSearch.searchQuery)}</p>
            {selectedPost && renderComments(selectedPost.id)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <UserModal isOpen={showUserModal} onOpenChange={setShowUserModal} />
    </Card>
  )
}

export default PostsManager
