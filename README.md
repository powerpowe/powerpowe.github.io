# powerpowe-blog

개인 블로그. Next.js 16 (App Router) · Tailwind CSS v4 · MDX.
글이 중심이고, CV와 소개는 곁가지입니다. 광고 자리는 미리 확보돼 있습니다.

## 실행

Node 20 이상이 필요합니다 (Tailwind v4 요구사항). nvm으로 설치되어 있습니다:

```bash
nvm use 22      # nvm alias default 22 를 이미 해뒀다면 생략
npm install
npm run dev     # http://localhost:3000
```

| 스크립트 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 정적 빌드 → `out/` |
| `npx serve out` | 빌드 결과 미리보기 (`npm start` 는 정적 내보내기에선 안 씁니다) |
| `npm run typecheck` | `tsc --noEmit` |

## 먼저 고쳐야 할 것

내용은 전부 플레이스홀더입니다. 이 순서로 채우면 됩니다.

1. **[`src/lib/site.ts`](src/lib/site.ts)** — 이름, 소개 문구, 소속, 배포 도메인(`url`),
   소셜 링크. 사이트 대부분이 여기서 값을 읽어 갑니다. `url`은 OG 태그·RSS·사이트맵의
   절대 주소로 쓰이니 실제 도메인으로 꼭 바꾸세요.
   특히 `tagline` 은 대문의 `<h1>` 으로 그대로 나갑니다.
2. **[`content/blog/`](content/blog/)** — 샘플 글 2개는 지우고 본인 글을 넣으세요.
   대문의 LATEST 자리에 가장 최근 글이 자동으로 올라갑니다.
3. **[`src/lib/cv.ts`](src/lib/cv.ts)** — 경력, 학력, 스킬, 논문, 수상. `/cv` 가
   이 파일만 렌더링합니다. `TODO:` 로 표시된 줄을 채우세요.
4. **[`src/app/(full)/about/page.tsx`](src/app/(full)/about/page.tsx) 의 소개 문단**
5. **[`public/images/`](public/images/)** — `placeholder.png` 는 테스트용입니다.
   본인 사진·그림으로 바꾸고, `/about` 과 `/cv` 의 `<Image>` 를 거기에 맞추세요.
6. **[`src/app/icon.svg`](src/app/icon.svg)** — 파비콘.

## 라우트

| 경로 | 성격 | 사이드바·광고 |
|---|---|---|
| `/` | **대문.** 최신 글 하나를 크게 + 최근 글 목록 | 있음 |
| `/blog` | 글 목록 전체 | 있음 |
| `/blog/<slug>` | 글 본문 | 있음 |
| `/tags/<태그>` | 태그별 목록 | 있음 |
| `/about` | 소개 | **없음** (전체 폭) |
| `/cv` | 이력 | **없음** (전체 폭) |

사이드바 유무는 **라우트 그룹** 두 개로 가릅니다. 그룹 이름은 URL에 안 들어갑니다
— `(sidebar)/blog/page.tsx` 는 그냥 `/blog` 입니다.

- [`(sidebar)/layout.tsx`](src/app/(sidebar)/layout.tsx) — 2단 그리드 + 사이드바.
  **읽는 페이지들**이 여기 들어갑니다.
- [`(full)/layout.tsx`](src/app/(full)/layout.tsx) — 단일 칼럼(`max-w-4xl`).
  `/about` 과 `/cv` 뿐입니다.

`/about` 과 `/cv` 에 광고를 안 붙이는 건 의도적입니다. **CV는 리크루터한테 직접
보내는 페이지**라 옆에 배너가 붙으면 그 링크의 값이 깎입니다. 수익 손실도 거의
없습니다 — 검색 유입은 글 페이지로 꽂히기 때문에 노출의 대부분이 `/blog/<slug>`
에서 나오고, 이 두 페이지의 비중은 미미합니다.

라우트를 옮기고 싶으면 폴더를 그룹 사이에서 이동만 하면 됩니다.

## 레이아웃

블로그 우선 구조입니다. 대문에서도 최신 글이 주인공이고, 자기소개·CV는 뒤로 물러나
별도 페이지로 빠져 있습니다.

```
┌────────────────────────────────────────────────────┐
│ ▌Byungjoon Lee        WRITING ABOUT CV   ☾         │ ← sticky, h-16
├────────────────────────────────────────────────────┤
│ ┌──────────────────────────┐  ┌─────────────────┐  │
│ │ 2026-07-12 · 6 min       │  │ TOPICS          │  │
│ │ 하이브리드 검색에서…       │  │ search       3  │  │
│ │ 요약…                     │  │ retrieval    2  │  │
│ │ #search #retrieval       │  │ data         1  │  │
│ ├──────────────────────────┤  │                 │  │
│ │ …                        │  ├─────────────────┤  │
│ ├──────────────────────────┤  │                 │  │
│ │ [광고 · in-feed]          │  │                 │  │
│ ├──────────────────────────┤  │ ┌─────────────┐ │  │
│ │ …                        │  │ │ 광고 sticky │ │  │
│ └──────────────────────────┘  │ └─────────────┘ │  │
│        main (1fr)             └─ aside 300px ───┘  │
└────────────────────────────────────────────────────┘
```

- 2단 쉘은 [`(sidebar)/layout.tsx`](src/app/(sidebar)/layout.tsx) 의
  `lg:grid-cols-[minmax(0,1fr)_300px]` 한 줄입니다.
- 사이드바([`sidebar.tsx`](src/components/sidebar.tsx))는 `lg` 미만에서 **사라집니다**.
  본문을 좁히지 않기 위해서고, 그 대신 좁은 화면에서는 광고가 피드 안으로 들어갑니다.
- 피드 카드는 전체가 클릭 영역(`absolute inset-0`)이지만 태그는 `z-10`으로 위에
  올려서 따로 눌립니다.
- 사이드바에 자기소개는 없습니다. `/about` · `/cv` 옆에 같은 내용이 작게 또 나오는
  게 어색해서 뺐습니다. 남은 건 Topics와 광고뿐입니다.
- 글 제목은 `<h2>`, 페이지당 `<h1>` 은 하나뿐입니다.

## 광고 붙이기

자리는 이미 다 잡혀 있고 실제 코드만 비어 있습니다.
[`ad-slot.tsx`](src/components/ad-slot.tsx) 하나가 세 종류의 슬롯을 관리합니다.

| 슬롯 | 위치 | 예약 높이 |
|---|---|---|
| `sidebar` | 사이드바 하단, `sticky top-24` | 600px |
| `in-feed` | 피드에서 글 4개마다 (마지막 뒤에는 안 붙음) | 280px |
| `in-article` | 글 상세에서 헤더 아래, 본문 위 | 280px |

**중요한 건 지금부터 높이를 예약해 둔다는 점입니다.** 나중에 광고를 넣어도 레이아웃이
밀리지 않습니다(CLS 방지). 개발 서버에서는 점선 박스로 자리가 보이고, 프로덕션
빌드에서는 아무것도 렌더되지 않습니다.

켜는 방법:

1. `.env.local` 에 `NEXT_PUBLIC_ADS_ENABLED=true`
2. [`ad-slot.tsx`](src/components/ad-slot.tsx) 의 주석 자리에 광고 유닛 코드를 넣기
   (AdSense라면 `<ins class="adsbygoogle">` 블록)
3. AdSense는 `<head>` 스크립트와 `public/ads.txt` 가 따로 필요합니다
4. 슬롯 크기를 바꾸면 `SLOTS` 의 `minHeight` 도 같이 맞춰주세요

`AD_EVERY` ([`post-feed.tsx`](src/components/post-feed.tsx))로 인피드 광고 간격을
조절합니다. 글이 4편 미만이면 인피드 광고는 아예 안 나옵니다.

## 글 쓰기

`content/blog/<slug>.mdx` 를 만들면 파일명이 그대로 URL이 됩니다.

```mdx
---
title: "글 제목"
summary: "목록에 노출되는 한 줄 요약."
date: 2026-07-26
tags: [search, nlp]
draft: false
---

본문. GFM 표, 각주, 체크박스 모두 됩니다.
```

- `title`, `date` 는 필수. 빠지면 빌드가 실패합니다.
- `draft: true` 는 개발 서버에서만 보이고 빌드에서 제외됩니다.
- 읽기 시간은 자동 계산됩니다 (한글/CJK와 라틴 문자를 각각 다른 속도로 셈).
- 수식은 `$인라인$` 과 `$$블록$$` — KaTeX로 렌더됩니다.
- 코드 블록에 파일명을 붙이려면: <code>```python title="rrf.py"</code>
- `tags` 에 쓴 값은 `/tags/<태그>` 페이지가 자동으로 생기고 사이드바 Topics에도
  개수와 함께 올라갑니다.
- 가장 최근 글이 대문의 LATEST 자리를 자동으로 차지합니다. 따로 지정하는 곳은
  없고 `date` 순입니다.

## 그림 넣기

이미지 파일은 **`public/images/`** 에 둡니다. 그러면 `/images/파일명` 으로 참조됩니다.

### 글(MDX) 안에서

일반 마크다운 문법 그대로입니다. 세 번째 인자(따옴표)는 **캡션**이 됩니다.

```mdx
![대체 텍스트](/images/chart.png)
![대체 텍스트](/images/chart.png "그림 아래 들어갈 캡션")
```

뒤에서 자동으로 처리되는 것들:

- **치수를 빌드 때 파일에서 직접 읽습니다**
  ([`rehype-image-size.ts`](src/lib/rehype-image-size.ts)). 마크다운 이미지에는
  크기 정보가 없어서 그냥 두면 이미지가 늦게 뜰 때 본문이 아래로 밀립니다(CLS).
  치수를 알아야 `next/image` 가 자리를 미리 잡아둘 수 있습니다.
- **png·jpg·webp** → `next/image`. 정적 배포라 리사이징은 꺼져 있고
  (`images.unoptimized`), 예약된 치수 + lazy loading만 적용됩니다. **원본을 적당한
  크기로 줄여서 커밋하세요** — 올린 파일이 그대로 나갑니다
- **svg** → 그냥 `<img>`. `next/image` 는 보안상 SVG를 막아두고 있고, 어차피
  최적화할 게 없습니다
- **외부 URL** → 그냥 `<img>`. 크기를 빌드 때 알 수 없어서요. 굳이 최적화하려면
  `next.config.ts` 에 `images.remotePatterns` 를 열어야 합니다
- 캡션을 쓰면 `<figure>` + `<figcaption>` 으로 감싸집니다

`content/blog/hybrid-search-notes.mdx` 에 SVG·PNG 예시가 하나씩 들어 있습니다.

### About / CV 같은 페이지(TSX)에서

**정적 import** 를 쓰는 게 낫습니다. 치수를 자동으로 잡고 **blur 플레이스홀더**
까지 만들어 줍니다.

```tsx
import Image from "next/image";
import portrait from "@public/images/portrait.jpg";   // @public → ./public

<Image
  src={portrait}
  alt=""
  placeholder="blur"
  sizes="(min-width: 640px) 640px, 100vw"
  className="h-auto w-full rounded-md border border-hairline"
/>
```

`@public/*` 별칭은 `tsconfig.json` 에 걸려 있습니다.

- `alt=""` 는 **장식용 이미지일 때만** 씁니다. 내용이 있는 그림이면 반드시 설명을
  적으세요 — 스크린리더와 SEO 둘 다에 쓰입니다.
- 화면 위쪽에 바로 보이는 이미지에는 `priority` 를 붙이세요 (lazy loading 해제).
- `sizes` 는 브라우저가 srcset에서 뭘 고를지 정하는 값입니다. 안 적으면 필요보다
  큰 파일을 받습니다.

`/cv` 의 증명사진은 `.no-print` 가 **아닙니다** — 인쇄본에도 같이 나갑니다.
사진 없이 가려면 [`cv/page.tsx`](src/app/(full)/cv/page.tsx) 의 `<Image>` 블록과
import를 지우면 됩니다. `/about` 도 마찬가지입니다.

### CV의 회사·학교·프로젝트 로고

[`src/lib/cv.ts`](src/lib/cv.ts) 의 각 항목에 `logo` 한 줄만 추가하면 됩니다.

```ts
{
  period: "2023 — Present",
  title: "Software Engineer",
  org: "Nurimedia (DBpia)",
  logo: "/images/logos/nurimedia.svg",   // ← 이 줄
  points: [...],
}
```

`Experience` · `Education` · `Projects` · `Awards` 전부 같은 방식입니다.
`logo` 를 안 적으면 그 줄에는 로고 없이 나옵니다 — 섞여 있어도 정렬이 안 깨집니다.

로고 파일은 `public/images/logos/` 에 둡니다. **SVG를 권장**합니다. 회사 로고는
대개 SVG로 제공되고, 28px로 그려지니 래스터를 최적화할 이유가 없습니다.

렌더링은 [`entry-logo.tsx`](src/components/entry-logo.tsx) 가 맡습니다:

- **높이 기준으로 정규화합니다** (24px 고정, 폭은 비율대로). 정사각형 칸에 밀어넣지
  않는 이유는 실제 로고 비율이 제각각이기 때문입니다 — DBpia 로고는 500×75, 즉
  6.67:1이라 정사각 칸에 넣으면 4px 높이로 찌부됩니다. 높이를 맞춰야 모양이 달라도
  같은 무게로 읽힙니다. 아주 넓은 워드마크는 160px에서 잘립니다.
- 폭이 줄마다 다르니 **제목 옆이 아니라 위에** 놓습니다. 옆에 두면 줄마다 본문
  시작 x좌표가 달라집니다.
- 치수를 빌드 때 파일에서 읽어([`public-image-size.ts`](src/lib/public-image-size.ts))
  `width`/`height` 를 박아둡니다. 로고가 로드되기 전에도 자리가 잡혀 있습니다.
- `next/image` 를 안 씁니다. 24px짜리는 최적화 이득이 없고, `next/image` 는
  `dangerouslyAllowSVG` 없이는 SVG를 거부합니다.
- `alt=""` + `aria-hidden` — 바로 옆에 회사 이름이 글자로 있으니 스크린리더가
  두 번 읽을 필요가 없습니다. 마우스를 올리면 `title` 로 이름이 뜹니다.
- 인쇄본에도 같이 나갑니다.

`projects` 항목에는 `href` 를 넣으면 제목이 링크가 됩니다.

### 스타일

`.prose img` 가 테두리와 라운드를 붙입니다 ([`globals.css`](src/app/globals.css)).
그림을 본문보다 넓게 빼고 싶으면 MDX에서 직접 감싸세요:

```mdx
<div className="-mx-6 sm:-mx-10">
  ![넓게 뺀 그림](/images/wide.png)
</div>
```

## 디자인 시스템

모든 색은 [`src/app/globals.css`](src/app/globals.css) 상단 한 곳에 모여 있습니다.
`:root` 가 라이트, `[data-theme="dark"]` 가 다크입니다.

| 토큰 | 라이트 | 다크 | 쓰임 |
|---|---|---|---|
| `--background` | `#ffffff` | `#0b0d10` | 페이지 바탕 |
| `--surface` | `#f4f5f7` | `#14171c` | 코드블록, hover 배경 |
| `--foreground` | `#0f1115` | `#e6e9ee` | 본문 |
| `--muted` | `#565f6c` | `#98a1af` | 보조 텍스트 |
| `--faint` | `#8a919d` | `#6b7482` | 캡션, 날짜, 라벨 |
| `--hairline` | `#e4e7eb` | `#222831` | 1px 구분선 |
| `--accent` | `#4c46d6` | `#a8a2ff` | 링크 hover, 활성 상태 |

색상 위계가 아니라 **굵기·크기·1px 선**으로 정보 구조를 만드는 게 이 디자인의
원칙입니다. 액센트는 "지금 여기"를 가리킬 때만 씁니다.

**액센트를 바꾸려면** `--accent` 와 `--accent-soft` 두 줄(라이트/다크 각각)만 고치면
전체에 반영됩니다. `--accent-soft` 는 같은 색 + 2자리 알파입니다.

폰트는 세 갈래입니다. 세리프는 쓰지 않습니다.

- **`font-display`** / **`font-sans`** — **Wanted Sans Variable**. 제목과 본문이
  같은 얼굴입니다. 한글·영문을 한 폰트가 커버하고 **92조각 unicode-range 서브셋**
  으로 배포돼서, 한 폰트로 통일해도 용량 부담이 없습니다 (가변, 웨이트 400–1000).
- **`font-label`** — JetBrains Mono. 날짜, 태그, 섹션 라벨, 워드마크 같은 UI 크롬.
- **`font-mono`** — JetBrains Mono. **코드 전용.** 라벨과 토큰이 분리돼 있어서
  둘 중 하나만 바꿀 수 있습니다.

### 폰트 갈아끼워 보기 (dev 전용)

개발 서버 우측 하단의 **`Aa 폰트`** 버튼을 누르면 프리셋 목록이 뜹니다. 고르면
새로고침 없이 사이트 전체 글꼴이 바뀌고, 선택은 localStorage에 남습니다.

| 프리셋 | 구성 | 특징 |
|---|---|---|
| Wanted Sans (전체) | **현재 설정** · 제목·본문 통일 | 92조각 split · 가변 |
| 나눔스퀘어 네오 제목 + Pretendard | 이전 설정 | 제목 385KB/웨이트 |
| SUIT + Pretendard | 기하학적 산세리프 | 가변 610KB 통짜 |
| IBM Plex Sans KR (전체) | 기술문서 느낌 | Google Fonts · 188조각 split |
| Noto Serif KR 제목 | 명조 제목 | 248조각 split · 논문지 느낌 |
| Noto Serif KR (전체) | 본문까지 명조 | 가장 이질적인 방향 |
| Paperlogy 제목 | 2024년 무료폰트 | 157KB/웨이트 · 아직 안 흔함 |
| Freesentation 제목 | 2024년 무료폰트 | 245KB/웨이트 |
| Pretendard (전체) | 제목까지 본문 폰트 | 가장 중립적 |

프리셋 정의는 [`src/lib/fonts.ts`](src/lib/fonts.ts) 에 있습니다. 항목을 추가하려면
`stylesheets`(외부 CSS) 또는 `faces`(raw `@font-face`)와 `display`/`sans` 값을
적으면 됩니다.

패널 아래쪽에 **라벨 축**이 따로 있습니다. 날짜·태그·섹션명·워드마크 같은 UI
크롬을 `모노 / 본문 폰트 / 제목 폰트` 중에 골라 볼 수 있습니다. 작은 대문자 모노
라벨이 사방에 깔린 건 요즘 템플릿의 특징이라, 그게 디자인을 지탱하는지 그냥
장식인지 판단하려면 꺼봐야 압니다. **코드 블록은 이 축에 안 딸려옵니다** — 항상
고정폭입니다.

### 폰트 토큰이 두 겹인 이유

`:root` 에 `--display-font` `--sans-font` `--mono-font` `--label-font` 네 개가
실제 스택을 들고 있고, `@theme inline` 은 `--font-display: var(--display-font)`
처럼 **별칭만** 겁니다. 색상 토큰과 같은 구조입니다.

스택을 `@theme inline` 에 직접 쓰면 안 됩니다. `inline` 은 토큰 값을 유틸리티에
그대로 펼쳐 넣기 때문에 `.font-display` 가 `font-family: "Wanted Sans Variable", …`
로 굳어버려서 런타임에 못 바꿉니다. 한 겹 우회하면
`font-family: var(--display-font)` 로 남아서 스위처가 잡을 수 있습니다.

**폰트 스택을 바꿀 땐 `:root` 의 `--*-font` 를 고치세요.** `@theme` 쪽 별칭은
건드릴 일이 없습니다.

**마음에 드는 걸 고른 뒤 실제로 적용하려면** 두 군데를 고칩니다:

1. `layout.tsx` — `ReactDOM.preinit()` 의 스타일시트 URL (또는 `globals.css` 에
   `@font-face` 추가)
2. `globals.css` `:root` 의 `--display-font` / `--sans-font`

스위처와 기본 프리셋 외의 폰트는 **프로덕션 빌드에 안 들어갑니다.** `next/dynamic`
으로 별도 청크에 격리해서 프로덕션이 아예 참조하지 않습니다 — 정적 import를
`NODE_ENV` 로 감싸는 것만으로는 부족합니다. 분기가 `false` 여도 모듈 그래프에 남아
16 KB짜리 클라이언트 청크로 전송됩니다.

### 왜 Wanted Sans 한 폰트인가

한국어 웹폰트는 보통 통짜 파일이라 제목·본문을 나눠 써야 했습니다. 실측 비교:

| | 배포 방식 | 크기 |
|---|---|---|
| **Wanted Sans Variable** | **92조각 split** | 조각당 소량 |
| Pretendard Variable | 92조각 split | 조각당 소량 |
| 나눔스퀘어 네오 Variable | 통짜 | 1,529 KB |
| 나눔스퀘어 네오 정적 1웨이트 | 통짜 | 385 KB |
| SUIT Variable | 통짜 | 610 KB |

split이면 브라우저가 **페이지에 실제로 나온 글자가 든 조각만** 받습니다. 그래서
제목·본문을 한 폰트로 통일해도 통짜 폰트 하나보다 가볍습니다.

폰트 preload는 안 겁니다 — split이라 미리 받을 만한 단일 파일이 없고, 어떤 조각이
필요한지는 페이지 텍스트마다 다릅니다. 스타일시트는 `layout.tsx` 에서
`ReactDOM.preinit()` 으로 겁니다 (`<head>` 에 `<link>` 를 직접 쓰면 React가
hoisting하면서 태그가 중복됩니다).

라이선스는 OFL이라 상업적 사용·임베딩 모두 자유입니다.

`.display-tight` 는 큰 제목용 유틸리티입니다. 자간은 `-0.02em` 까지만 좁힙니다 —
나눔스퀘어는 네모반듯하고 넓은 글자꼴이라 이보다 더 좁히면 한글 속공간이 막힙니다.
같은 이유로 행간도 라틴 전용 디스플레이 폰트보다 여유를 줬습니다. 인쇄 시에는
자동으로 22pt로 줄어듭니다.

본문은 `.prose max-w-[68ch]` 로 칼럼 폭과 별개로 가독 폭을 따로 잡습니다 — 사이드바가
사라지는 넓은 화면에서도 한 줄이 늘어지지 않게 하기 위해서입니다.

다크 모드는 `<html data-theme>` 속성으로 동작하고,
[`theme-script.tsx`](src/components/theme-script.tsx) 가 첫 페인트 전에 인라인으로
실행돼서 새로고침 시 색이 번쩍이지 않습니다.

## 구조

```
content/blog/                 글 (.mdx)
public/images/                그림 → /images/파일명 으로 참조
src/lib/site.ts               이름·링크·네비  ← 여기부터
src/lib/cv.ts                 CV 데이터
src/lib/posts.ts              MDX 읽기, 정렬, 읽기시간, 태그
src/lib/rehype-image-size.ts  빌드 때 이미지 치수 읽어 CLS 방지
src/components/site-header.*  상단 sticky 바
src/components/post-feed.*    피드 카드 + 인피드 광고 삽입
src/components/sidebar.*      우측 300px (소개·Topics·광고)
src/components/ad-slot.*      광고 슬롯 3종
src/app/globals.css           디자인 토큰 + .prose + 인쇄 스타일
src/app/page.tsx              대문 (사이드바 없음)
src/app/(sidebar)/            나머지 전부 (2단 그리드 + 사이드바)
```

## 인쇄

`/cv` 에서 Ctrl+P 하면 바로 PDF가 나옵니다. `.print-reset` 이 2단 그리드를 풀어 전체
폭 한 칼럼으로 되돌리고, 헤더·사이드바·푸터·버튼은 `.no-print` 로 빠지며 팔레트가
흑백으로 고정됩니다. CV 페이지가 이름을 `<h1>` 으로 들고 있어서 인쇄물이 이름부터
시작합니다.

## 배포 — GitHub Pages

정적 사이트로 내보내서 GitHub Pages에 올립니다. `main` 에 푸시하면
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 이 빌드해서 배포합니다.

### 한 번만 하면 되는 설정

1. 저장소 이름이 **정확히 `powerpowe.github.io`** 여야 합니다 (유저 사이트).
   다른 이름이면 `powerpowe.github.io/저장소이름` 으로 뜨고, 그 경우
   `next.config.ts` 에 `basePath` 와 `assetPrefix` 를 추가해야 합니다.
2. GitHub 저장소 → **Settings → Pages → Source** 를 **GitHub Actions** 로 바꾸기.
   (기본값인 "Deploy from a branch" 로 두면 워크플로가 배포를 못 합니다.)
3. 푸시.

```bash
git init && git add -A && git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:powerpowe/powerpowe.github.io.git
git push -u origin main
```

### 정적 배포라서 달라지는 점

`next.config.ts` 의 세 줄이 핵심입니다.

| 설정 | 이유 |
|---|---|
| `output: "export"` | Node 서버 없이 `out/` 에 순수 파일만 생성 |
| `trailingSlash: true` | Pages는 `/blog` 를 `/blog/index.html` 로 찾습니다. 없으면 404 |
| `images: { unoptimized: true }` | `/_next/image` 는 서버 라우트라 정적 호스팅에 존재할 수 없음 |

**이미지 최적화만 없어집니다.** 그림은 그대로 뜨고 blur 플레이스홀더도 살아 있습니다
(빌드 때 base64로 박히니까요). 리사이징·webp 변환이 없을 뿐이라, **커밋 전에 적당한
크기로 줄여서 올리세요.**

`public/.nojekyll` 은 지우지 마세요. Jekyll이 `_next` 같은 밑줄로 시작하는 폴더를
무시해버려서, 없으면 CSS와 JS가 전부 404 납니다.

`robots.ts` 와 `sitemap.ts` 의 `export const dynamic = "force-static"` 도 필수입니다.
없으면 `output: "export"` 빌드가 실패합니다.

### 왜 Vercel이 아닌가

**Vercel Hobby 플랜은 광고를 금지합니다** — AdSense와 제휴링크 모두 포함이고, 상업적
사용 자체가 약관 위반이라 Pro($20/월)가 필요합니다. 광고 계획이 있으면 걸립니다.

| | 광고 | 이미지 최적화 | 비용 |
|---|---|---|---|
| GitHub Pages | ✅ | ❌ | 무료 |
| Cloudflare Pages | ✅ | ❌ | 무료 |
| Vercel Hobby | ❌ | ✅ | 무료 |
| Vercel Pro | ✅ | ✅ | $20/월 |

Cloudflare Pages로 옮기고 싶으면 같은 `out/` 을 그대로 쓰면 됩니다 — 빌드 명령
`npm run build`, 출력 디렉터리 `out`. 국내 응답 속도는 그쪽이 낫습니다.

### 커스텀 도메인

`public/CNAME` 파일에 도메인만 한 줄 적고, DNS를 GitHub Pages로 향하게 하면 됩니다.
그리고 [`src/lib/site.ts`](src/lib/site.ts) 의 `url` 을 새 도메인으로 바꾸세요 —
OG 태그·RSS·사이트맵의 절대 주소가 여기서 나갑니다.

### 로컬에서 배포 결과 확인

```bash
npm run build
npx serve out          # 또는: cd out && python3 -m http.server 4000
```
