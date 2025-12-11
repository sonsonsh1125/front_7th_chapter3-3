import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"
import { usePostPagination } from "../../../entities/post/model"

/**
 * 게시물 페이지네이션 위젯
 */
interface PostPaginationProps {
  total: number
}

export const PostPagination = ({ total }: PostPaginationProps) => {
  const { limit, skip, canGoPrevious, goToPreviousPage, goToNextPage, changeLimit } = usePostPagination()
  const canGoNext = skip + limit < total

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => changeLimit(Number(value))}>
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
        <Button disabled={!canGoPrevious} onClick={goToPreviousPage}>
          이전
        </Button>
        <Button disabled={!canGoNext} onClick={goToNextPage}>
          다음
        </Button>
      </div>
    </div>
  )
}

