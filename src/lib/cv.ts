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
  /** Rendered as a bulleted list. Keep each line to one accomplishment. */
  points?: string[];
  /** Shown on project entries as a link on the title. */
  href?: string;
};

export type CvPublication = {
  authors: string;
  title: string;
  venue: string;
  year: string;
  href?: string;
};

export const summary =
  "검색 시스템과 언어 데이터를 다루는 엔지니어입니다. 학술 데이터베이스 환경에서 검색 품질 개선과 데이터 파이프라인 구축을 맡고 있습니다.";

export const experience: CvEntry[] = [
  {
    period: "2026.01 — Present",
    title: "AI Engineer (전문연구요원)",
    org: "Nurimedia (DBpia)",
    location: "Korea",
    logo: "/images/logos/dbpia_logo.webp",
    points: [
      "실시간 Layout Detection 및 OCR 파이프라인 서빙",
      "VLM 기반 문서 정보 추출 추출 에이전트 구축 기반 AX",
      "대량의 내부 문서 구조화 파이프라인을 통한 DBpia 정보화",
    ],
  },
];

export const education: CvEntry[] = [
  {
    period: "2020 — 2024",
    title: "B.S. in Computer Science and Engineering",
    org: "성균관대학교",
    location: "Korea",
    logo: "/images/logos/school_logo.png",
  },
  
];

export const projects: CvEntry[] = [
  {
    period: "2025",
    title: "TODO: 프로젝트 이름",
    org: "개인 프로젝트",
    logo: "/images/logos/project.svg",
    href: "https://github.com/",
    points: [
      "무엇을 만들었고 어떤 문제를 풀었는지 한 줄",
      "쓴 기술과, 가능하면 규모나 결과를 숫자로",
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "SQL", "Java"] },
  {
    group: "Search & Data",
    items: ["Elasticsearch", "OpenSearch", "PostgreSQL", "Airflow"],
  },
  { group: "ML / NLP", items: ["PyTorch", "Hugging Face", "sentence-transformers"] },
  { group: "Infra", items: ["Docker", "AWS", "GitHub Actions"] },
];

export const publications: CvPublication[] = [
  // {
  //   authors: "Lee, B., et al.",
  //   title: "Paper title",
  //   venue: "Conference",
  //   year: "2025",
  //   href: "https://…",
  // },
];

export const awards: CvEntry[] = [
  // { period: "2024", title: "Award name", org: "Organization" },
];
