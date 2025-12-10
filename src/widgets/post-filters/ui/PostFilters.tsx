import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"
import { PostSearchInput } from "../../../features/post-search"
import { PostSortSelect } from "../../../features/post-sort"
import { useTagList } from "../../../entities/tag/model"

interface PostFiltersProps {
  initialSearchQuery?: string
  initialSortBy?: string
  initialSortOrder?: string
  initialTag?: string
  onTagChange?: (tag: string) => void
  onUpdateURL?: () => void
}

/**
 * 게시물 필터 위젯 (검색, 태그, 정렬 통합)
 */
export const PostFilters = ({
  initialSearchQuery,
  initialSortBy,
  initialSortOrder,
  initialTag,
  onTagChange,
  onUpdateURL,
}: PostFiltersProps) => {
  const { tags } = useTagList()

  const handleTagChange = (value: string) => {
    onTagChange?.(value)
    onUpdateURL?.()
  }

  return (
    <div className="flex gap-4">
      <PostSearchInput initialQuery={initialSearchQuery} />
      <Select value={initialTag || "all"} onValueChange={handleTagChange}>
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
      <PostSortSelect initialSortBy={initialSortBy} initialSortOrder={initialSortOrder} />
    </div>
  )
}
