import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../shared/ui"
import { buildQueryString, getURLParam, getURLNumberParam } from "../shared/lib/utils"
import { DEFAULT_LIMIT, DEFAULT_SKIP, DEFAULT_SORT_ORDER } from "../shared/config"
import { usePostStore } from "../entities/post/model"
import { PostCreateDialog } from "../features/post-create"
import { PostEditDialog } from "../features/post-edit"
import { CommentCreateDialog } from "../features/comment-create"
import { CommentEditDialog } from "../features/comment-edit"
import { UserModal } from "../features/user-view"
import { PostList } from "../widgets/post-list"
import { PostDetailDialog } from "../widgets/post-detail"
import { PostFilters } from "../widgets/post-filters"
import { PostPagination } from "../widgets/post-pagination"
import type { Post } from "../entities/post/model"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // Zustand 스토어
  const { skip, limit, setSkip, setLimit } = usePostStore()

  // 로컬 UI 상태
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedTag, setSelectedTag] = useState(getURLParam(queryParams, "tag"))

  // URL 파라미터
  const searchQuery = getURLParam(queryParams, "search")
  const sortBy = getURLParam(queryParams, "sortBy")
  const sortOrder = getURLParam(queryParams, "sortOrder", DEFAULT_SORT_ORDER)

  // URL 업데이트 함수
  const updateURL = () => {
    const queryString = buildQueryString({
      skip,
      limit,
      search: searchQuery,
      sortBy,
      sortOrder,
      tag: selectedTag,
    })
    navigate(`?${queryString}`)
  }

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
    updateURL()
  }

  const handlePostDetailClick = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // URL 파라미터 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const urlSkip = getURLNumberParam(params, "skip", DEFAULT_SKIP)
    const urlLimit = getURLNumberParam(params, "limit", DEFAULT_LIMIT)
    const urlTag = getURLParam(params, "tag")

    // URL에서 읽은 값이 현재 상태와 다를 때만 업데이트
    if (urlSkip !== skip) {
      setSkip(urlSkip)
    }
    if (urlLimit !== limit) {
      setLimit(urlLimit)
    }
    if (urlTag !== selectedTag) {
      setSelectedTag(urlTag)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

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
          <PostFilters
            initialSearchQuery={searchQuery}
            initialSortBy={sortBy}
            initialSortOrder={sortOrder}
            initialTag={selectedTag}
            onTagChange={handleTagChange}
            onUpdateURL={updateURL}
          />

          {/* 게시물 목록 */}
          <PostList
            selectedTag={selectedTag}
            searchQuery={searchQuery}
            onPostDetailClick={handlePostDetailClick}
            showEditDialog={showEditDialog}
            onEditDialogChange={setShowEditDialog}
            showUserModal={showUserModal}
            onUserModalChange={setShowUserModal}
          />

          {/* 페이지네이션 */}
          <PostPagination />
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
      <PostDetailDialog
        isOpen={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        searchQuery={searchQuery}
      />

      {/* 사용자 모달 */}
      <UserModal isOpen={showUserModal} onOpenChange={setShowUserModal} />
    </Card>
  )
}

export default PostsManager
