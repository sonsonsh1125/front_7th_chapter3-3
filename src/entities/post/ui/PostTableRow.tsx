import { Edit2, MessageSquare, Trash2 } from "lucide-react"
import { Button, TableCell, TableRow } from "../../../shared/ui"
import { PostTitle } from "./PostTitle"
import { UserAvatar } from "../../user/ui/UserAvatar"
import { PostReactions } from "./PostReactions"
import type { Post } from "../model"

interface PostTableRowProps {
  post: Post
  searchQuery?: string
  onPostDetailClick?: (post: Post) => void
  onPostEditClick?: (post: Post) => void
  onPostDeleteClick?: (postId: number) => void
  onUserClick?: (user: { id: number }) => void
}

/**
 * 게시물 테이블 행 컴포넌트
 */
export const PostTableRow = ({
  post,
  searchQuery = "",
  onPostDetailClick,
  onPostEditClick,
  onPostDeleteClick,
  onUserClick,
}: PostTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <PostTitle post={post} searchQuery={searchQuery} />
      </TableCell>
      <TableCell>
        <UserAvatar user={post.author} onClick={onUserClick} />
      </TableCell>
      <TableCell>
        <PostReactions reactions={post.reactions} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onPostDetailClick?.(post)}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onPostEditClick?.(post)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onPostDeleteClick?.(post.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

