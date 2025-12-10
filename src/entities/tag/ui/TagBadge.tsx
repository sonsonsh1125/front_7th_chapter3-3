interface TagBadgeProps {
  tag: string
  selected?: boolean
  onClick?: (tag: string) => void
}

/**
 * 태그 배지 컴포넌트
 */
export const TagBadge = ({ tag, selected = false, onClick }: TagBadgeProps) => {
  return (
    <span
      className={`px-1 text-[9px] font-semibold rounded-[4px] ${
        selected
          ? "text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
      } ${onClick ? "cursor-pointer" : ""}`}
      onClick={() => onClick?.(tag)}
    >
      {tag}
    </span>
  )
}

