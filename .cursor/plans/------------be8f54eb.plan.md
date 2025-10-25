<!-- be8f54eb-557c-4f10-9733-9b921acfeef2 b25e7820-3d24-40de-8e53-9539f4fe9aa7 -->
# 스케줄러 프로젝트 단계별 구축 계획

## Phase 1: 프로젝트 기초 세팅 (모노레포 구조 이해하기)

### 1-1. Turborepo + pnpm 모노레포 초기화

**개념 설명:**

- **모노레포**: 여러 패키지를 하나의 저장소에서 관리 (코드 공유 쉬움)
- **Turborepo**: 빌드/테스트를 병렬로 빠르게 실행
- **pnpm**: npm보다 빠르고 디스크 공간 절약

**작업:**

- `create-turbo`로 모노레포 생성 (pnpm 옵션 선택)
- 자동으로 생성되는 구조 확인:
  - `apps/web` (Next.js 메인 스케줄러 앱)
  - `apps/docs` (UI 컴포넌트 문서 페이지 - Storybook 대신 활용)
  - `packages/ui` (공유 UI - shadcn 컴포넌트)
  - `packages/typescript-config`
  - `packages/eslint-config` (ESLint 설정)
- 기본 구조 이해하기
- `apps/docs`를 UI 컴포넌트 쇼케이스로 활용할 예정

**명령어:**

```bash
# 1. Turborepo 생성 (자동으로 git init 실행됨)
npx create-turbo@latest bc-scheduler
# 프롬프트에서 pnpm 선택

cd bc-scheduler

# 2. Git 설정 확인 (현재 글로벌 설정)
git config --global user.name
git config --global user.email

# 3. 이 프로젝트에만 개인 계정 설정 (회사 계정과 분리)
git config --local user.name "ninpeng"
git config --local user.email "ninpeng@naver.com"

# 설정 확인 (로컬 설정이 우선 적용됨)
git config user.name
git config user.email

# 4. .gitignore 수정 (계획 파일 공유)
cat >> .gitignore << 'EOF'

# Cursor 설정 제외하지만 계획은 포함
.cursor/*
!.cursor/plans/
EOF

# 5. Git 상태 확인
git status

# 6. GitHub 저장소 연결 (미리 GitHub에서 저장소 생성 필요)
git remote add origin https://github.com/ninpeng/bc-scheduler.git

# 7. 첫 커밋 및 푸시
git add .
git commit -m "feat: 초기 프로젝트 세팅"
git push -u origin main
```

**참고:**

- create-turbo는 자동으로 `.git` 폴더와 `.gitignore` 생성
- Vercel 배포 시 Git 저장소 연결이 필요하므로 초반에 설정

### 1-2. ESLint 제거 및 Biome 설정

**개념 설명:**

- **Biome**: Prettier + ESLint를 하나로 합친 최신 도구
- 훨씬 빠르고 설정 간단
- create-turbo는 기본적으로 ESLint를 포함하므로 제거 필요

**작업:**

- ESLint 관련 파일 제거:
  - `packages/eslint-config` 폴더 삭제
  - 각 앱의 `.eslintrc.js` 파일 삭제
  - `package.json`에서 eslint 관련 패키지 제거
- Biome 설치 (루트에):
  - `pnpm add -Dw @biomejs/biome`
- `biome.json` 설정 파일 생성 (루트 하나만)
- 포맷팅 규칙 설정
- package.json 스크립트 추가:
  - `"lint": "biome check ."`
  - `"format": "biome format --write ."`

**명령어:**

```bash
rm -rf packages/eslint-config
find . -name ".eslintrc.js" -delete
find . -name ".eslintrc.json" -delete
pnpm add -Dw @biomejs/biome
pnpm biome init
```

### 1-3. Tailwind CSS 공유 설정

**개념 설명:**

- **Tailwind Preset**: 공통 디자인 토큰(색상, 간격 등)을 여러 앱에서 재사용
- 모노레포에서 일관된 디자인 시스템 유지
- `packages/ui`의 shadcn 컴포넌트도 같은 설정 사용

**작업:**

- `packages/tailwind-config` 패키지 생성
- 공통 Tailwind 설정 정의 (색상, 폰트, 간격 등)
- `apps/web`에서 preset으로 사용
- PostCSS 설정

**명령어:**

```bash
mkdir -p packages/tailwind-config
cd packages/tailwind-config
pnpm init
pnpm add -D tailwindcss
```

### 1-4. Next.js 15 + TypeScript 설정

**작업:**

- App Router 구조 확인
- Tailwind CSS를 `packages/tailwind-config` preset과 연결
- 기본 레이아웃 구성
- 개발 서버 실행 및 확인

**명령어:**

```bash
cd apps/web
pnpm dev
```

## Phase 2: UI 기초 구축 (프론트엔드만 먼저)

### 2-1. shadcn/ui 설치 및 디자인 시스템 구성

**개념 설명:**

- shadcn/ui는 설치형이 아닌 복사형 컴포넌트
- `packages/ui`에 복사해서 프로젝트 전체에서 사용

**작업:**

- shadcn/ui CLI로 초기 설정
- 필요한 기본 컴포넌트 추가 (Button, Card, Dialog 등)
- `packages/ui`에 공유 컴포넌트 구성

**명령어:**

```bash
cd packages/ui
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card dialog input label
```

### 2-2. 기본 스케줄 목록 UI 만들기 (하드코딩 데이터)

**개념 설명:**

- DB 연결 전에 UI부터 만들고 테스트
- Mock 데이터로 화면 구성

**작업:**

- 스케줄 아이템 컴포넌트 생성
- 목록 화면 레이아웃
- 반응형 디자인 적용

**명령어:**

```bash
cd apps/web
mkdir -p app/components
```

### 2-3. 스케줄 등록/수정/삭제 폼 UI

**작업:**

- 모달 또는 사이드 패널 형태의 폼
- 시간 입력 컴포넌트
- 유효성 검사 (React Hook Form)

**명령어:**

```bash
cd apps/web
pnpm add react-hook-form @hookform/resolvers zod
```

## Phase 3: 데이터베이스 이해하기

### 3-1. Supabase 프로젝트 생성 및 개념 학습

**개념 설명:**

- **데이터베이스**: 데이터를 저장하는 창고
- **PostgreSQL**: 테이블 형태로 데이터 저장 (엑셀처럼)
- **Supabase**: PostgreSQL을 쉽게 쓸 수 있게 해주는 서비스

**작업:**

- Supabase 계정 생성
- 새 프로젝트 생성
- 대시보드 둘러보기

**URL:** https://supabase.com

### 3-2. Prisma ORM 설치 및 이해

**개념 설명:**

- **ORM**: SQL 몰라도 JavaScript로 DB 다룰 수 있게 해주는 도구
- **스키마**: 데이터 구조 정의 (어떤 필드가 있는지)
- **마이그레이션**: DB 구조 변경 이력 관리

**작업:**

- Prisma 설치
- Supabase 연결 설정
- `.env` 파일 생성 (DB URL)

**명령어:**

```bash
cd apps/web
pnpm add prisma @prisma/client
pnpm add -D prisma
pnpm prisma init
```

### 3-3. 스케줄 테이블 설계

**개념 설명:**

- 스케줄에 필요한 정보: 제목, 시작시간, 종료시간, 설명 등
- `userId` 필드 미리 추가 (나중에 회원 기능용)

**작업:**

- Schedule 모델 정의
- 마이그레이션 실행 (DB에 테이블 생성)
- Prisma Studio로 확인

**명령어:**

```bash
pnpm prisma migrate dev --name init
pnpm prisma generate
pnpm prisma studio
```

## Phase 4: 백엔드 로직 구현 (Server Actions)

### 4-1. Server Actions 개념 이해

**개념 설명:**

- **Server Actions**: 서버에서 실행되는 함수 (API Routes 불필요)
- **'use server'**: 서버 전용 코드임을 표시
- **장점**: API 엔드포인트 없이 타입 세이프하게 DB 접근
- **CRUD**: Create(생성), Read(조회), Update(수정), Delete(삭제)

**왜 Server Actions?**

- API Routes보다 간단 (코드 적음)
- TypeScript 타입이 자동으로 전달됨
- Next.js 15의 권장 방식

**작업:**

- `lib/actions/schedule.ts` 파일 생성
- 'use server' 지시어 이해
- Prisma 클라이언트 설정

### 4-2. Server Components에서 데이터 조회

**개념 설명:**

- **Server Component**: 서버에서만 실행되는 컴포넌트 (기본값)
- DB를 직접 쿼리 가능 (API 불필요)
- 빌드 시 자동으로 최적화

**작업:**

- 메인 페이지를 Server Component로 만들기
- Prisma로 스케줄 목록 직접 가져오기
- 하드코딩된 사용자 ID 사용
- Client Component에 데이터 전달

### 4-3. Server Actions로 생성/수정/삭제

**개념 설명:**

- **useFormState**: 폼 제출과 서버 액션 연결 (React 19)
- **revalidatePath**: 데이터 변경 후 화면 새로고침
- **Zod**: TypeScript 타입과 런타임 검증을 동시에
- **에러 처리**: try-catch로 안전하게 처리

**작업:**

- `createSchedule` 액션 구현
- `updateSchedule` 액션 구현
- `deleteSchedule` 액션 구현
- Zod로 입력 검증

### 4-4. Client Components와 통합

**개념 설명:**

- **'use client'**: 클라이언트에서 실행되는 컴포넌트 (상호작용 필요 시)
- **useFormState**: 액션 상태 관리
- **useOptimistic**: 낙관적 UI 업데이트 (선택적)

**작업:**

- 폼 컴포넌트를 Client Component로 변경
- useFormState로 Server Actions 호출
- 로딩/에러 상태 처리
- 성공 시 토스트 메시지

## Phase 4.5: 테스트 작성 (Vitest)

### 4.5-1. Vitest 설치 및 설정

**개념 설명:**

- **Vitest**: Jest보다 빠른 최신 테스트 프레임워크
- Jest와 문법이 거의 같아서 기존 지식 활용 가능
- Next.js 15와 잘 맞고 설정이 간단함

**작업:**

- Vitest 설치 및 설정
- TypeScript, Prisma mock 설정
- 테스트 스크립트 추가

### 4.5-2. API 단위 테스트 작성

**개념 설명:**

- **단위 테스트**: API 엔드포인트별로 독립적으로 테스트
- **Mocking**: 실제 DB 대신 가짜 데이터 사용
- **왜 필요한가**: 버그를 빨리 찾고, 리팩토링 시 안전성 확보

**작업:**

- `createSchedule` Server Action 테스트
- `updateSchedule`, `deleteSchedule` 테스트
- 에러 케이스 테스트

**명령어:**

```bash
cd apps/web
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
pnpm test
```

### 4.5-3. React 컴포넌트 테스트 (선택적)

**개념 설명:**

- Testing Library 활용 (이미 경험 있음)
- 중요한 컴포넌트만 테스트 (시간 효율)

**작업:**

- 스케줄 폼 컴포넌트 테스트
- 버튼 클릭, 입력 검증 테스트

## Phase 5: 고급 기능 구현

### 5-1. 드래그 앤 드롭으로 순서 변경

**개념 설명:**

- `@dnd-kit/core`: 드래그 앤 드롭 라이브러리
- 순서 저장을 위한 `order` 필드 추가

**작업:**

- dnd-kit 설치 및 설정
- 스케줄 순서 변경 UI
- 순서 업데이트 Server Action

**명령어:**

```bash
cd apps/web
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 5-2. 일정 충돌 감지 및 자동 조정

**개념 설명:**

- 시간 겹침 확인 로직
- 영향받는 일정 찾기

**작업:**

- 충돌 감지 함수
- 사용자에게 알림 (Toast/Modal)
- 자동 시간 조정 옵션

### 5-3. 캘린더 뷰 추가

**작업:**

- `react-big-calendar` 또는 `@fullcalendar/react` 설치
- 캘린더에 스케줄 표시
- 캘린더에서 직접 일정 생성

**명령어:**

```bash
cd apps/web
pnpm add react-big-calendar date-fns
```

## Phase 6: 배포 및 마무리

### 6-1. Vercel 배포

**개념 설명:**

- Git 연동으로 자동 배포
- 환경 변수 설정 (DB 연결 정보)

**작업:**

- GitHub 저장소 연결
- Vercel 프로젝트 생성
- 환경 변수 설정 (`DATABASE_URL`)
- 배포 확인

**URL:** https://vercel.com

### 6-2. 최종 테스트 및 버그 수정

## 예상 파일 구조

```
bc-scheduler/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── components/
│   │   ├── lib/
│   │   │   └── actions/
│   │   │       └── schedule.ts   # Server Actions
│   │   └── prisma/
│   │       └── schema.prisma
│   └── docs/                     # UI 문서 페이지
├── packages/
│   ├── ui/                       # shadcn 컴포넌트
│   ├── tailwind-config/          # 공유 Tailwind
│   └── typescript-config/
├── .cursor/
│   └── plans/                    # 계획 문서
├── .gitignore
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 학습 포인트

각 단계마다:

1. **무엇을** 만드는지
2. **왜** 이렇게 하는지
3. **어떻게** 동작하는지

상세히 설명하면서 진행합니다.

---

## 보일러플레이트 구분

### 🚀 Part 1: 보일러플레이트 (재사용 가능)

다른 프로젝트에서도 활용 가능한 기본 설정

- **Phase 1**: 모노레포 기초 (Turborepo, Biome, Tailwind, Next.js)
- **Phase 2-1**: shadcn/ui 설정
- **Phase 3**: DB 기초 (Supabase, Prisma)

### 📱 Part 2: 스케줄러 기능 (프로젝트 특화)

이 프로젝트만의 비즈니스 로직

- **Phase 2-2, 2-3**: 스케줄 UI
- **Phase 4**: Server Actions (CRUD)
- **Phase 4.5**: 테스트
- **Phase 5**: 고급 기능
- **Phase 6**: 배포

---

**Part 1: 보일러플레이트**

- [ ] Turborepo + pnpm 모노레포 구조 생성
- [ ] Biome 포맷터 설치 및 설정
- [ ] Tailwind CSS 공유 설정 패키지 생성
- [ ] Next.js 15 + TypeScript 설정 확인
- [ ] shadcn/ui 및 디자인 시스템 구성
- [ ] Supabase 프로젝트 생성 및 연결
- [ ] Prisma ORM 설치 및 스키마 정의

**Part 2: 스케줄러 기능**

- [ ] 스케줄 목록 UI 구현 (Mock 데이터)
- [ ] 스케줄 등록/수정/삭제 폼 UI
- [ ] Server Actions로 CRUD 구현
- [ ] Client Components와 Server Actions 통합
- [ ] Vitest 설치 및 테스트 작성
- [ ] 드래그 앤 드롭 기능 구현
- [ ] 일정 충돌 감지 및 자동 조정
- [ ] 캘린더 뷰 추가
- [ ] Vercel 배포 및 환경 변수 설정

### To-dos

- [ ] Turborepo + pnpm 모노레포 구조 생성
- [ ] Biome 포맷터 설치 및 설정
- [ ] Tailwind CSS 공유 설정 패키지 생성
- [ ] Next.js 15 + TypeScript 설정 확인
- [ ] shadcn/ui 및 디자인 시스템 구성
- [ ] 스케줄 목록 UI 구현 (Mock 데이터)
- [ ] 스케줄 등록/수정/삭제 폼 UI
- [ ] Supabase 프로젝트 생성 및 연결
- [ ] Prisma ORM 설치 및 스키마 정의
- [ ] Server Actions로 CRUD 구현
- [ ] Client Components와 Server Actions 통합
- [ ] Vitest 설치 및 테스트 작성
- [ ] 드래그 앤 드롭 기능 구현
- [ ] 일정 충돌 감지 및 자동 조정
- [ ] 캘린더 뷰 추가
- [ ] Vercel 배포 및 환경 변수 설정