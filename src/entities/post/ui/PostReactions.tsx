import { ThumbsDown, ThumbsUp } from "lucide-react"
import type { PostReactions as PostReactionsType } from "../model"

interface PostReactionsProps {
  reactions?: PostReactionsType
}

/**
 * 게시물 반응 컴포넌트
 */
export const PostReactions = ({ reactions }: PostReactionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <ThumbsUp className="w-4 h-4" />
      <span>{reactions?.likes || 0}</span>
      <ThumbsDown className="w-4 h-4" />
      <span>{reactions?.dislikes || 0}</span>
    </div>
  )
}

