/**
 * Font presets for the development-only switcher.
 *
 * Only the `default` preset's assets are declared in `globals.css` and shipped
 * to production. Every other preset is loaded on demand by the switcher, so
 * browsing them in dev costs a production build nothing.
 *
 * Once you pick one: put its stylesheet <link> (or `@font-face`) in
 * `layout.tsx` / `globals.css`, and point `--display-font` / `--sans-font` at
 * it. Those are the role properties in `:root` — not the `@theme` aliases,
 * which get expanded at build time.
 *
 * "split" means the font is served as unicode-range subsets: the browser
 * fetches only the chunks containing glyphs the page actually renders, which
 * is dramatically cheaper for Korean. It is why the default can afford to use
 * one face for both headings and body.
 */

export type FontPreset = {
  id: string;
  label: string;
  /** Short note shown in the switcher. */
  note: string;
  /** External stylesheets to <link> in. */
  stylesheets?: string[];
  /** Raw @font-face CSS to inject, for fonts served as bare woff2 files. */
  faces?: string;
  /** Value for --font-display (headings). */
  display: string;
  /** Value for --font-sans (body). */
  sans: string;
};

const PRETENDARD =
  '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

/** Pretendard is no longer loaded by default, so presets using it must ask. */
const PRETENDARD_CSS =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

const WANTED_SANS =
  '"Wanted Sans Variable", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
const WANTED_SANS_CSS =
  "https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css";

/**
 * The second axis of the switcher: what the UI chrome is set in — dates, tags,
 * section captions, the wordmark, nav. `--font-label`, not `--font-mono`;
 * code always stays monospaced.
 *
 * Worth flipping through. Tiny monospaced uppercase labels everywhere are a
 * strong current-template signature, and seeing the same page with them set in
 * the body or display face is the fastest way to judge whether they are
 * carrying the design or just decorating it.
 */
export const LABEL_MODES = [
  { id: "mono", label: "모노", note: "현재 · JetBrains Mono" },
  { id: "sans", label: "본문 폰트", note: "라벨을 본문과 같은 얼굴로" },
  { id: "display", label: "제목 폰트", note: "라벨을 제목과 같은 얼굴로" },
] as const;

export type LabelMode = (typeof LABEL_MODES)[number]["id"];

/** Fonts distributed by noonnu as bare woff2 files, one per weight. */
function noonnuFaces(
  family: string,
  regular: string,
  bold: string,
): string {
  return `
@font-face {
  font-family: "${family}";
  src: url("${regular}") format("woff2");
  font-weight: 300 500;
  font-display: swap;
}
@font-face {
  font-family: "${family}";
  src: url("${bold}") format("woff2");
  font-weight: 600 800;
  font-display: swap;
}`;
}

export const FONT_PRESETS: FontPreset[] = [
  {
    id: "default",
    label: "Wanted Sans (전체)",
    note: "현재 설정 · 92조각 split · 제목·본문 한 폰트",
    stylesheets: [WANTED_SANS_CSS],
    display: WANTED_SANS,
    sans: WANTED_SANS,
  },
  {
    id: "nanumsquare",
    label: "나눔스퀘어 네오 제목 + Pretendard",
    note: "이전 설정 · 제목 385KB/웨이트",
    stylesheets: [PRETENDARD_CSS],
    faces: noonnuFaces(
      "NanumSquare Neo",
      "https://cdn.jsdelivr.net/gh/eunchurn/NanumSquareNeo@0.0.6/woff2/NanumSquareNeoTTF-bRg.woff2",
      "https://cdn.jsdelivr.net/gh/eunchurn/NanumSquareNeo@0.0.6/woff2/NanumSquareNeoTTF-cBd.woff2",
    ),
    display: '"NanumSquare Neo", ' + PRETENDARD,
    sans: PRETENDARD,
  },
  {
    id: "suit",
    label: "SUIT + Pretendard",
    note: "기하학적 산세리프 · 가변 610KB 통짜",
    stylesheets: [
      PRETENDARD_CSS,
      "https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css",
    ],
    display: '"SUIT Variable", ' + PRETENDARD,
    sans: PRETENDARD,
  },
  {
    id: "plex",
    label: "IBM Plex Sans KR (전체)",
    note: "Google Fonts · 188조각 split · 기술문서 느낌",
    stylesheets: [
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap",
    ],
    display: '"IBM Plex Sans KR", ' + PRETENDARD,
    sans: '"IBM Plex Sans KR", ' + PRETENDARD,
  },
  {
    id: "serif",
    label: "Noto Serif KR 제목 + Pretendard",
    note: "Google Fonts · 248조각 split · 문학적·논문지 느낌",
    stylesheets: [
      PRETENDARD_CSS,
      "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&display=swap",
    ],
    display: '"Noto Serif KR", Georgia, serif',
    sans: PRETENDARD,
  },
  {
    id: "serif-full",
    label: "Noto Serif KR (전체)",
    note: "본문까지 명조 · 가장 이질적인 방향",
    stylesheets: [
      "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&display=swap",
    ],
    display: '"Noto Serif KR", Georgia, serif',
    sans: '"Noto Serif KR", Georgia, serif',
  },
  {
    id: "paperlogy",
    label: "Paperlogy 제목 + Pretendard",
    note: "2024년 무료폰트 · 157KB/웨이트 · 아직 안 흔함",
    stylesheets: [PRETENDARD_CSS],
    faces: noonnuFaces(
      "Paperlogy",
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2",
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-7Bold.woff2",
    ),
    display: '"Paperlogy", ' + PRETENDARD,
    sans: PRETENDARD,
  },
  {
    id: "freesentation",
    label: "Freesentation 제목 + Pretendard",
    note: "2024년 무료폰트 · 245KB/웨이트 · 또렷한 인상",
    stylesheets: [PRETENDARD_CSS],
    faces: noonnuFaces(
      "Freesentation",
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2404@1.0/Freesentation-5Medium.woff2",
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2404@1.0/Freesentation-7Bold.woff2",
    ),
    display: '"Freesentation", ' + PRETENDARD,
    sans: PRETENDARD,
  },
  {
    id: "pretendard",
    label: "Pretendard (전체)",
    note: "가장 중립적 · 제목까지 본문 폰트로 통일",
    stylesheets: [PRETENDARD_CSS],
    display: PRETENDARD,
    sans: PRETENDARD,
  },
];
