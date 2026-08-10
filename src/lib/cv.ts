/**
 * CV content. Everything on /cv is rendered from this file — edit here, not the
 * page component. Values are placeholders; replace them with your own.
 */

export type CvEntry = {
  /** e.g. "2023 — Present" */
  period: string;
  title: string;
  org: string;
  location?: string;
  /**
   * Path to a logo under `public/`, e.g. "/images/logos/acme.svg".
   *
   * Rendered inside a fixed square with `object-contain`, so any aspect ratio
   * fits without distorting and without shifting the row while it loads. SVG
   * is ideal — these draw at ~28px, where optimising a raster buys nothing.
   * Omit the field and the row simply has no logo.
   */
  logo?: string;
  /**
   * Render height in px, overriding the 28px default.
   *
   * Needed because equal canvas height does not mean equal apparent size. A
   * one-line wordmark fills its canvas with letterforms; a university lockup
   * stacks an emblem over two lines of type, so at the same height its text is
   * a third the size and unreadable. No ratio rule fixes that — the difference
   * is in what the image contains. Nudge it by eye.
   */
  logoHeight?: number;
  /** Rendered as a bulleted list. Keep each line to one accomplishment. */
  points?: string[];
  /** Shown on project entries as a link on the title. */
  href?: string;
};

/**
 * A paper or project, rendered as a figure on the left with its details on the
 * right — the layout academic homepages use, because a paper's teaser figure
 * says more at a glance than its title does.
 */
export type CvWork = {
  title: string;
  /**
   * Full author list as one string, in publication order. Your own name is
   * bolded automatically — see `highlightAuthors`. Mark co-first authorship
   * with an asterisk the way the venue does: "Jane Doe*, John Roe*".
   */
  authors?: string;
  /** The italic line: "CVPR 2026", "Preprint", "개인 프로젝트 · 2025". */
  venue: string;
  /** Optional callout after the venue, e.g. "Oral, top 3%". Rendered accented. */
  note?: string;
  /** Teaser figure under `public/`. Omit it and the text spans full width. */
  thumb?: string;
  /** Trailing link row: Project page, Code, arXiv, demo, whatever applies. */
  links?: { label: string; href: string }[];
};

/**
 * Spellings of your own name to render bold in author lists. Include every
 * variant you publish under — hyphenation and romanisation differ by venue.
 */
export const highlightAuthors = ["Byungjoon Lee", "Byung-Joon Lee", "이병준"];

export const summary =
  "석사 중엔 Domain-Agnostic AI, Vision-Language Model을 연구했으며, 현재는 경험을 살려 DBpia에서 Retrieval, Multi-Agent System, VLM 기반 Document Analysis를 다루는 AI Engineer로 일하고 있습니다. ";

export const experience: CvEntry[] = [
  {
    period: "2026.01 — Present",
    title: "AI Engineer (전문연구요원)",
    org: "Nurimedia (DBpia)",
    location: "",
    logo: "/images/logos/dbpia_logo.webp",
    points: [
      "실시간 Layout Detection 및 OCR 파이프라인 서빙",
      "VLM 기반 문서 정보 추출 추출 에이전트 구축 기반 AX",
      "대량의 내부 문서 구조화 파이프라인을 통한 DBpia 정보화",
    ],
  },
  {
    period: "2023.06 — 2026.01",
    title: "Graduate/Undergraduate Researcher",
    org: "SKKU Information & Intelligence System Laboratory",
    location: "",
    logo: "/images/logos/iislab_logo.png",
        logoHeight: 44,        // 기본값 28
    points: [
      "연구 분야: Domain Adaptation · Continual Learning · Vision-Language Model",
      "삼성전자 산학협력 수행: 마스크 패턴에서 SEM 이미지 생성, CD 자동 측정 모델 개발 ",
      "국제학회 논문 3편 게재 (CVPR, BMVC 등)",
    ],
  },
    {
    period: "2022.06 — 2023.04",
    title: "Undergraduate Researcher",
    org: "SKKU Machine Intelligence & Data Science Laboratory",
    location: "",
    points: [
      "헬스케어 기업 산학협력 수행: 심전도 기반 우울증 탐지 모델 개발",
    ],
  },
];

export const education: CvEntry[] = [
    {
    period: "2024 — 2026",
    title: "M.S. in Computer Science and Engineering",
    org: "성균관대학교",
    location: "지도교수: 이지형",
        logo: "/images/logos/school_logo.png",
    logoHeight: 44,        // 기본값 28
  },
  {
    period: "2020 — 2024",
    title: "B.S. in Mathematics & Applied Artificial Intelligence",
    org: "성균관대학교",
    location: "",
  },


  
];

export const projects: CvWork[] = [
  {
    title: "TODO: 프로젝트 이름",
    venue: "개인 프로젝트 · 2025",
    thumb: "/images/works/placeholder-wide.png",
    links: [
      { label: "Code", href: "https://github.com/powerpowe" },
      { label: "Demo", href: "https://example.com" },
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "MLops", 
    items: ["Prefect", "Phoenix", "FastAPI"] 
  },
  {
    group: "DL & ML",
    items: ["PyTorch", "OpenCV", "Pandas", "Onnxruntime", "scikit-learn", "matplotlib"],
  },
  { 
    group: "LLM", 
    items: ["vLLM", "Hugging Face", "transformers", "openai"] },
  { group: "Infra", 
    items: ["Docker", "Jenkins", "conda", "uv"] 
  },
  { group: "Others", 
    items: ["PyMuPDF", "selenium", "beautifulsoup"] 
  },
];

export const publications: CvWork[] = [
  // TODO: 본인 논문으로 교체하세요. 이 항목은 모든 필드 사용 예시입니다.
  {
    title: "TODO: 논문 제목",
    authors: "First Author*, Byungjoon Lee*, Third Author",
    venue: "Preprint",
    note: "Oral, top 3%",
    thumb: "/images/works/placeholder-wide.png",
    links: [
      { label: "arXiv", href: "https://arxiv.org/" },
      { label: "Code", href: "https://github.com/powerpowe" },
      { label: "Project page", href: "https://example.com" },
    ],
  },
];

export const awards: CvEntry[] = [
  // { period: "2024", title: "Award name", org: "Organization" },
];
