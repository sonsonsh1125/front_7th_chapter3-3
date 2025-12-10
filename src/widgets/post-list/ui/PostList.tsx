import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/utils"
import { usePostList } from "../../../entities/post/model"
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
  const { posts, loading } = usePostList(selectedTag)
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
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, postSearch.searchQuery)}</div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="px-1 text-[9px] font-semibold rounded-[4px] text-blue-800 bg-blue-100">
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
                <Button variant="ghost" size="sm" onClick={() => onPostDetailClick?.(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => postEdit.openDialog(post)}>
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
}
