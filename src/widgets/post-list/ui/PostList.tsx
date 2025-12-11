import { Table, TableBody, TableHead, TableHeader, TableRow } from "../../../shared/ui"
import { usePostList } from "../../../entities/post/model"
import { PostTableRow } from "../../../entities/post/ui"
import { usePostEdit } from "../../../features/post-edit"
import { usePostDelete } from "../../../features/post-delete"
import { usePostSearch } from "../../../features/post-search"
import { useUserView } from "../../../features/user-view"
import type { Post } from "../../../entities/post/model"

interface PostListProps {
  selectedTag?: string
  searchQuery?: string
  onPostDetailClick?: (post: Post) => void
  showEditDialog?: boolean
  onEditDialogChange?: (open: boolean) => void
  showUserModal?: boolean
  onUserModalChange?: (open: boolean) => void
}

/**
 * 게시물 목록 테이블 위젯
 */
export const PostList = ({
  selectedTag,
  searchQuery = "",
  onPostDetailClick,
  showEditDialog,
  onEditDialogChange,
  showUserModal,
  onUserModalChange,
}: PostListProps) => {
  const { posts, loading } = usePostList(selectedTag, searchQuery)
  const postEdit = usePostEdit(showEditDialog, onEditDialogChange)
  const postDelete = usePostDelete()
  const postSearch = usePostSearch(searchQuery)
  const userView = useUserView(showUserModal, onUserModalChange)

  if (loading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
  }

  return (
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
        {posts.map((post: Post) => (
          <PostTableRow
            key={post.id}
            post={post}
            searchQuery={postSearch.searchQuery}
            onPostDetailClick={onPostDetailClick}
            onPostEditClick={postEdit.openDialog}
            onPostDeleteClick={postDelete.deletePost}
            onUserClick={userView.openModal}
          />
        ))}
      </TableBody>
    </Table>
  )
}
