import { Search } from "lucide-react"
import { Input } from "../../../shared/ui"
import { usePostSearch } from "../model/usePostSearch"

interface PostSearchInputProps {
  initialQuery?: string
}

/**
 * 게시물 검색 입력 컴포넌트
 */
export const PostSearchInput = ({ initialQuery }: PostSearchInputProps) => {
  const { searchQuery, isSearching, updateSearchQuery, search } = usePostSearch(initialQuery)

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => updateSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && search()}
          disabled={isSearching}
        />
      </div>
    </div>
  )
}

