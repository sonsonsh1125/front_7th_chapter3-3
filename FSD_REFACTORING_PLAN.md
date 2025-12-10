# FSD 리팩토링 작업 순서

## 개요

현재 `PostsManagerPage.tsx`에 집중된 코드를 FSD(Feature-Sliced Design) 아키텍처로 리팩토링합니다.

## 현재 문제점

1. 컴포넌트가 너무 크고 복잡함 (709줄)
2. TypeScript 타입 처리가 부실함
3. 상태 관리 개념 없이 너무 많은 상태를 가짐
4. useEffect 관리가 안됨
5. 비동기 처리 로직이 복잡하게 구성됨

## 목표 (README 기준)

1. **TypeScript를 확실히 사용해서 코드의 이해와 리팩토링에 대한 안정성을 확보**
   - 모든 컴포넌트와 함수에 타입 정의
   - 엔티티별 타입을 명확히 정의
   - 타입 안정성을 통한 리팩토링 안전성 확보

2. **컴포넌트에 단일 책임 원칙을 부여하여 작게 만들기**
   - 큰 컴포넌트를 작은 단위로 분리
   - 각 컴포넌트가 하나의 책임만 가지도록 구성
   - 재사용 가능한 컴포넌트 설계

3. **적절한 관심사의 분리를 통해서 폴더구조 만들기**
   - UI, 로직, API, 상태 관리를 적절히 분리
   - FSD 계층 구조를 통한 관심사 분리
   - 각 레이어의 역할과 책임 명확화

4. **FSD를 한번 적용하기**
   - app, pages, widgets, features, entities, shared 계층 구조 적용
   - FSD 계층 규칙 준수
   - 계층 간 의존성 관리

---

## 작업 순서

### 1단계: 타입 정의 및 엔티티 분리 (entities/model)

**목적**: 비즈니스 엔티티의 타입을 정의하여 이후 작업의 기반 마련 (타입 안정성 확보 및 의존성 명확화)

**작업 내용**:

- `entities/post/model/` 생성
  - `types.ts`: Post, PostReactions 타입 정의
  - `index.ts`: 타입 export
- `entities/comment/model/` 생성
  - `types.ts`: Comment 타입 정의
  - `index.ts`: 타입 export
- `entities/user/model/` 생성
  - `types.ts`: User 타입 정의
  - `index.ts`: 타입 export
- `entities/tag/model/` 생성
  - `types.ts`: Tag 타입 정의
  - `index.ts`: 타입 export

**타입 정의 예시**:

```typescript
// entities/post/model/types.ts
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: PostReactions
  author?: User
}

export interface PostReactions {
  likes: number
  dislikes: number
}
```

**체크리스트**:

- [x] Post 엔티티 타입 정의 완료
- [x] Comment 엔티티 타입 정의 완료
- [x] User 엔티티 타입 정의 완료
- [x] Tag 엔티티 타입 정의 완료
- [x] 모든 타입이 index.ts에서 export됨

---

### 2단계: 공통 UI 컴포넌트 분리 (shared/ui)

**목적**: 가장 독립적이고 안전하게 분리할 수 있는 레이어 분리

**작업 내용**:

- `shared/ui/` 폴더 구조 생성
  ```
  shared/
    ui/
      button/
        Button.tsx
        index.ts
      input/
        Input.tsx
        index.ts
      card/
        Card.tsx
        CardHeader.tsx
        CardTitle.tsx
        CardContent.tsx
        index.ts
      dialog/
        Dialog.tsx
        DialogContent.tsx
        DialogHeader.tsx
        DialogTitle.tsx
        index.ts
      table/
        Table.tsx
        TableHeader.tsx
        TableBody.tsx
        TableRow.tsx
        TableHead.tsx
        TableCell.tsx
        index.ts
      select/
        Select.tsx
        SelectTrigger.tsx
        SelectContent.tsx
        SelectItem.tsx
        index.ts
      textarea/
        Textarea.tsx
        index.ts
      index.ts (전체 export)
  ```
- 기존 `components/index.tsx`의 컴포넌트들을 위 구조로 이동
- 각 컴포넌트에 적절한 타입 정의 추가 (1단계에서 정의한 타입 활용)
- `shared/ui/index.ts`에서 모든 컴포넌트 export

**체크리스트**:

- [x] shared/ui 폴더 구조 생성 완료
- [x] 모든 UI 컴포넌트가 적절한 폴더로 분리됨
- [x] 각 컴포넌트에 TypeScript 타입이 정의됨
- [x] 기존 import 경로가 정상 작동함

---

### 3단계: API 레이어 분리 (entities/api)

**목적**: API 호출 로직을 엔티티별로 분리하여 재사용성 확보

**작업 내용**:

- `entities/post/api/` 생성
  - `postApi.ts`:
    - `fetchPosts(limit, skip)`
    - `addPost(post)`
    - `updatePost(id, post)`
    - `deletePost(id)`
    - `searchPosts(query)`
    - `fetchPostsByTag(tag)`
- `entities/comment/api/` 생성
  - `commentApi.ts`:
    - `fetchComments(postId)`
    - `addComment(comment)`
    - `updateComment(id, comment)`
    - `deleteComment(id)`
    - `likeComment(id)`
- `entities/user/api/` 생성
  - `userApi.ts`:
    - `fetchUsers(limit, select)`
    - `fetchUserById(id)`
- `entities/tag/api/` 생성
  - `tagApi.ts`:
    - `fetchTags()`

**체크리스트**:

- [x] 모든 API 함수가 적절한 엔티티 폴더에 분리됨
- [x] API 함수들이 적절한 타입을 사용함
- [x] 에러 핸들링이 포함됨
- [x] API 함수들이 순수 함수로 작성됨 (상태 관리 없음)

---

### 4단계: 상태 관리 도입 및 분리

**목적**: 전역 상태 관리를 통해 Props Drilling 최소화 및 상태 관리 체계화

**작업 내용**:

- 상태 관리 라이브러리 선택 및 설치
  - 옵션: Context API / Jotai / Zustand
- `entities/post/model/` 또는 `shared/store/` 생성
  - 게시물 상태 관리 (posts, total, loading, skip, limit)
- `entities/comment/model/` 생성
  - 댓글 상태 관리 (comments 객체)
- 필터/검색 상태는 features로 이동 (5단계에서 처리)

**상태 관리 구조 예시**:

```typescript
// entities/post/model/usePostStore.ts (Zustand 예시)
export const usePostStore = create((set) => ({
  posts: [],
  total: 0,
  loading: false,
  // ...
}))
```

**체크리스트**:

- [x] 상태 관리 라이브러리 설치 완료
- [x] 게시물 관련 상태가 전역 상태로 관리됨
- [x] 댓글 관련 상태가 전역 상태로 관리됨
- [x] Props Drilling이 최소화됨

---

### 5단계: 기능 분리 (features)

**목적**: 사용자 행동(이벤트 처리)을 기능 단위로 분리

**작업 내용**:

- `features/post-create/` 생성
  - `ui/PostCreateDialog.tsx`: 게시물 추가 다이얼로그
  - `model/usePostCreate.ts`: 게시물 생성 로직 훅 (entities/post/api 사용)
- `features/post-edit/` 생성
  - `ui/PostEditDialog.tsx`: 게시물 수정 다이얼로그
  - `model/usePostEdit.ts`: 게시물 수정 로직 훅 (entities/post/api 사용)
- `features/post-delete/` 생성
  - `model/usePostDelete.ts`: 게시물 삭제 로직 훅 (entities/post/api 사용)
- `features/post-search/` 생성
  - `ui/PostSearchInput.tsx`: 검색 입력 컴포넌트
  - `model/usePostSearch.ts`: 검색 로직 훅 (entities/post/api 사용)
- `features/post-sort/` 생성
  - `ui/PostSortSelect.tsx`: 정렬 선택 컴포넌트
  - `model/usePostSort.ts`: 정렬 로직 훅
- `features/comment-create/` 생성
  - `ui/CommentCreateDialog.tsx`: 댓글 추가 다이얼로그
  - `model/useCommentCreate.ts`: 댓글 생성 로직 훅 (entities/comment/api 사용)
- `features/comment-edit/` 생성
  - `ui/CommentEditDialog.tsx`: 댓글 수정 다이얼로그
  - `model/useCommentEdit.ts`: 댓글 수정 로직 훅 (entities/comment/api 사용)
- `features/comment-delete/` 생성
  - `model/useCommentDelete.ts`: 댓글 삭제 로직 훅 (entities/comment/api 사용)
- `features/comment-like/` 생성
  - `model/useCommentLike.ts`: 댓글 좋아요 로직 훅 (entities/comment/api 사용)
- `features/user-view/` 생성
  - `ui/UserModal.tsx`: 사용자 정보 모달
  - `model/useUserView.ts`: 사용자 정보 조회 로직 훅 (entities/user/api 사용)

**주의사항**:

- features는 entities의 api를 직접 호출하여 사용
- 각 feature의 model 훅에서 entities/api를 import하여 사용
- feature 내부에 별도의 api 폴더를 만들지 않음 (entities의 api를 재사용)

**체크리스트**:

- [x] 각 기능이 독립적인 폴더로 분리됨
- [x] UI와 로직이 분리됨 (ui/, model/)
- [x] 각 기능이 단일 책임을 가짐
- [x] 이벤트 처리가 적절히 분리됨
- [x] features가 entities의 api를 적절히 사용함
- [x] useEffect 관리가 적절히 이루어짐 (각 feature의 model 훅에서 관리)

---

### 6단계: 위젯 분리 (widgets)

**목적**: 데이터를 재사용 가능한 형태로 분리하여 독립적인 UI 블록 구성

**작업 내용**:

- `widgets/post-list/` 생성
  - `ui/PostList.tsx`: 게시물 목록 테이블 위젯
  - `model/usePostList.ts`: 게시물 목록 로직 훅
- `widgets/post-detail/` 생성
  - `ui/PostDetailDialog.tsx`: 게시물 상세 다이얼로그 위젯
  - `model/usePostDetail.ts`: 게시물 상세 로직 훅
- `widgets/comment-section/` 생성
  - `ui/CommentSection.tsx`: 댓글 섹션 위젯 (목록 + 추가)
  - `model/useCommentSection.ts`: 댓글 섹션 로직 훅
- `widgets/post-filters/` 생성
  - `ui/PostFilters.tsx`: 검색, 태그, 정렬 통합 필터 위젯
  - `model/usePostFilters.ts`: 필터 로직 훅
- `widgets/post-pagination/` 생성
  - `ui/PostPagination.tsx`: 페이지네이션 위젯
  - `model/usePostPagination.ts`: 페이지네이션 로직 훅

**체크리스트**:

- [ ] 위젯들이 독립적으로 동작함
- [ ] 위젯들이 재사용 가능한 형태로 구성됨
- [ ] 위젯 내부에서 필요한 features를 적절히 사용함
- [ ] 데이터 흐름이 명확함

---

### 7단계: 엔티티 UI 컴포넌트 분리 (entities/ui)

**목적**: 엔티티별 UI 컴포넌트를 분리하여 재사용성 확보

**작업 내용**:

- `entities/post/ui/` 생성
  - `PostTableRow.tsx`: 게시물 테이블 행 컴포넌트
  - `PostTitle.tsx`: 게시물 제목 컴포넌트 (하이라이트 포함)
- `entities/comment/ui/` 생성
  - `CommentItem.tsx`: 댓글 아이템 컴포넌트
  - `CommentList.tsx`: 댓글 목록 컴포넌트
- `entities/user/ui/` 생성
  - `UserAvatar.tsx`: 사용자 아바타 컴포넌트
  - `UserInfo.tsx`: 사용자 정보 컴포넌트
- `entities/tag/ui/` 생성
  - `TagBadge.tsx`: 태그 배지 컴포넌트
  - `TagFilter.tsx`: 태그 필터 컴포넌트

**체크리스트**:

- [ ] 엔티티별 UI 컴포넌트가 분리됨
- [ ] 컴포넌트들이 재사용 가능함
- [ ] 컴포넌트들이 적절한 props 타입을 가짐

---

### 8단계: 공통 로직 및 유틸리티 분리 (shared/lib)

**목적**: 공통으로 사용되는 유틸리티 함수와 로직 분리

**작업 내용**:

- `shared/lib/utils/` 생성
  - `highlightText.ts`: 텍스트 하이라이트 유틸리티
  - `urlParams.ts`: URL 파라미터 관리 유틸리티
- `shared/config/` 생성
  - `constants.ts`: 상수 정의 (기본 limit, skip 등)

**체크리스트**:

- [ ] 공통 유틸리티 함수가 분리됨
- [ ] 상수들이 적절히 정의됨
- [ ] 유틸리티 함수들이 순수 함수로 작성됨

---

### 9단계: 페이지 리팩토링 (pages)

**목적**: 페이지 컴포넌트를 위젯과 기능의 조합으로 단순화

**작업 내용**:

- `pages/posts-manager/` 생성
  - `ui/PostsManagerPage.tsx`: 위젯들을 조합하여 페이지 구성
  - 페이지는 위젯과 기능을 조합하는 역할만 수행
  - 상태 관리나 비즈니스 로직은 위젯/기능으로 위임

**체크리스트**:

- [ ] 페이지 컴포넌트가 간결해짐
- [ ] 페이지가 위젯과 기능의 조합만 담당함
- [ ] 복잡한 로직이 위젯/기능으로 분리됨

---

### 10단계: 앱 레이어 구성 (app)

**목적**: 앱 초기화, 프로바이더, 라우팅 설정

**작업 내용**:

- `app/` 폴더 생성
  - `providers/` 생성
    - `StateProvider.tsx`: 상태 관리 Provider
    - `index.ts`: Provider 조합
  - `router/` 생성 (필요시)
    - `routes.tsx`: 라우팅 설정
  - `App.tsx` 이동 및 리팩토링
    - Provider와 Router 설정만 담당

**체크리스트**:

- [ ] 앱 레이어가 적절히 구성됨
- [ ] Provider가 올바르게 설정됨
- [ ] 라우팅이 적절히 구성됨 (필요시)

---

### 11단계: 최종 정리 및 검증

**목적**: 리팩토링 완료 후 최종 점검 및 정리

**작업 내용**:

- Import 경로 정리
  - 절대 경로 설정 (tsconfig.json)
  - 모든 import가 올바른 경로를 사용하는지 확인
- 불필요한 파일 제거
  - 기존 `components/` 폴더 정리
  - 사용하지 않는 파일 제거
- 타입 안정성 검증
  - TypeScript 컴파일 에러 확인
  - 모든 타입이 올바르게 정의되었는지 확인
- 컴포넌트 단일 책임 확인
  - 각 컴포넌트가 하나의 책임만 가지는지 확인
- Props Drilling 최소화 확인
  - 전역 상태 관리가 적절히 사용되었는지 확인
- FSD 계층 규칙 확인
  - 상위 레이어가 하위 레이어만 import하는지 확인
  - 순환 참조가 없는지 확인
- useEffect 관리 확인
  - 각 feature/widget의 model 훅에서 useEffect가 적절히 관리되는지 확인
  - 불필요한 useEffect가 없는지 확인
  - 의존성 배열이 올바르게 설정되었는지 확인

**체크리스트**:

- [ ] 모든 import 경로가 정리됨
- [ ] 불필요한 파일이 제거됨
- [ ] TypeScript 컴파일 에러가 없음
- [ ] 각 컴포넌트가 단일 책임을 가짐
- [ ] Props Drilling이 최소화됨
- [ ] FSD 계층 규칙이 준수됨
- [ ] useEffect 관리가 적절히 이루어짐
- [ ] 모든 기능이 정상 작동함

---

## README 목표 달성 확인

### 목표 1: TypeScript 확실히 사용

- ✅ **1단계**: 엔티티별 타입 정의 (Post, Comment, User, Tag)
- ✅ **2단계**: UI 컴포넌트에 타입 정의 추가
- ✅ **3단계**: API 함수에 타입 적용
- ✅ **5단계**: Feature 훅에 타입 적용
- ✅ **11단계**: 타입 안정성 검증

### 목표 2: 컴포넌트 단일 책임 원칙

- ✅ **2단계**: 공통 UI 컴포넌트를 독립적으로 분리
- ✅ **5단계**: Feature별로 UI와 로직 분리
- ✅ **6단계**: Widget을 독립적인 UI 블록으로 구성
- ✅ **7단계**: 엔티티별 UI 컴포넌트 분리
- ✅ **9단계**: 페이지를 위젯 조합으로 단순화
- ✅ **11단계**: 각 컴포넌트의 단일 책임 확인

### 목표 3: 관심사의 분리

- ✅ **1단계**: 엔티티별 타입 분리
- ✅ **2단계**: 공통 UI 분리 (shared/ui)
- ✅ **3단계**: API 레이어 분리 (entities/api)
- ✅ **4단계**: 상태 관리 분리
- ✅ **5단계**: 기능별 분리 (features)
- ✅ **6단계**: 위젯 분리
- ✅ **7단계**: 엔티티 UI 분리
- ✅ **8단계**: 공통 로직 분리 (shared/lib)

### 목표 4: FSD 적용

- ✅ **전체 단계**: FSD 계층 구조 (app → pages → widgets → features → entities → shared)
- ✅ **10단계**: 앱 레이어 구성
- ✅ **11단계**: FSD 계층 규칙 확인

---

## README 체크리스트 대응표

README에 명시된 Basic 과제 체크리스트와 작업 단계의 대응 관계:

| 체크리스트 항목                                            | 대응 단계     | 확인 방법                                                 |
| ---------------------------------------------------------- | ------------- | --------------------------------------------------------- |
| 전역상태관리를 사용해서 상태를 분리하고 관리했나요?        | 4단계         | entities/post/model, entities/comment/model에서 상태 관리 |
| Props Drilling을 최소화했나요?                             | 4단계, 11단계 | 전역 상태 사용으로 Props 전달 최소화                      |
| shared 공통 컴포넌트를 분리했나요?                         | 2단계         | shared/ui/ 폴더에 모든 공통 컴포넌트 분리                 |
| shared 공통 로직을 분리했나요?                             | 8단계         | shared/lib/utils/ 폴더에 유틸리티 함수 분리               |
| entities를 중심으로 type을 정의하고 model을 분리했나요?    | 1단계, 4단계  | entities/\*/model/ 폴더에 타입과 상태 관리 분리           |
| entities를 중심으로 ui를 분리했나요?                       | 7단계         | entities/\*/ui/ 폴더에 엔티티별 UI 컴포넌트 분리          |
| entities를 중심으로 api를 분리했나요?                      | 3단계         | entities/\*/api/ 폴더에 API 함수 분리                     |
| feature를 중심으로 사용자행동(이벤트 처리)를 분리했나요?   | 5단계         | features/\*/model/ 폴더에 이벤트 처리 로직 분리           |
| feature를 중심으로 ui를 분리했나요?                        | 5단계         | features/\*/ui/ 폴더에 기능별 UI 컴포넌트 분리            |
| feature를 중심으로 api를 분리했나요?                       | 5단계         | features의 model 훅에서 entities/api 사용                 |
| widget을 중심으로 데이터를 재사용가능한 형태로 분리했나요? | 6단계         | widgets/\*/ 폴더에 재사용 가능한 위젯 구성                |

**결론**: ✅ 모든 README 목표와 체크리스트 항목이 작업 순서에 포함되어 있습니다.

---

## FSD 폴더 구조 최종 모습

```
src/
├── app/
│   ├── providers/
│   │   ├── StateProvider.tsx
│   │   └── index.ts
│   ├── router/
│   │   └── routes.tsx (선택)
│   └── App.tsx
├── pages/
│   └── posts-manager/
│       └── ui/
│           └── PostsManagerPage.tsx
├── widgets/
│   ├── post-list/
│   ├── post-detail/
│   ├── comment-section/
│   ├── post-filters/
│   └── post-pagination/
├── features/
│   ├── post-create/
│   ├── post-edit/
│   ├── post-delete/
│   ├── post-search/
│   ├── post-sort/
│   ├── comment-create/
│   ├── comment-edit/
│   ├── comment-delete/
│   ├── comment-like/
│   └── user-view/
├── entities/
│   ├── post/
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   ├── comment/
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   ├── user/
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   └── tag/
│       ├── api/
│       ├── model/
│       └── ui/
└── shared/
    ├── ui/
    │   ├── button/
    │   ├── input/
    │   ├── card/
    │   ├── dialog/
    │   ├── table/
    │   ├── select/
    │   └── textarea/
    ├── lib/
    │   └── utils/
    └── config/
        └── constants.ts
```

---

## FSD 계층 규칙

1. **상위 레이어는 하위 레이어만 import 가능**
   - app → pages → widgets → features → entities → shared
   - 같은 레이어 내에서는 import 불가 (예: feature → feature)

2. **공통 코드는 shared에 위치**
   - UI 컴포넌트, 유틸리티, 상수 등

3. **비즈니스 로직은 entities에 위치**
   - 데이터 모델, API, 엔티티 UI

4. **사용자 기능은 features에 위치**
   - 사용자 행동, 이벤트 처리

5. **복합 UI 블록은 widgets에 위치**
   - 여러 features/entities를 조합한 위젯

---

## 참고사항

- 각 단계를 완료한 후 테스트를 진행하여 기능이 정상 작동하는지 확인
- 단계별로 커밋을 진행하여 롤백이 가능하도록 함
- 타입 정의는 실제 사용되는 데이터 구조를 기반으로 작성
- 상태 관리 라이브러리는 프로젝트 요구사항에 맞게 선택
