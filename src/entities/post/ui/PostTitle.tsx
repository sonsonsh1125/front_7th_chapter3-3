import { highlightText } from "../../../shared/lib/utils"
import { TagBadge } from "../../tag/ui/TagBadge"
import type { Post } from "../model"

interface PostTitleProps {
  post: Post
  searchQuery?: string
}

/**
 * 게시물 제목 컴포넌트 (하이라이트 포함)
 */
export const PostTitle = ({ post, searchQuery = "" }: PostTitleProps) => {
  return (
    <div className="space-y-1">
      <div>{highlightText(post.title, searchQuery)}</div>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  )
}

