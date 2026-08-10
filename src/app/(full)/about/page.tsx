import type { Metadata } from "next";
import Image from "next/image";

import { SectionLabel } from "@/components/section-label";
import { site, socials } from "@/lib/site";

// A static import gives next/image the dimensions for free and lets it build a
// blur placeholder. Drop a file in public/images/ and point this at it.
import portrait from "@public/images/myphoto.jpg";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const links = socials.filter((s) => s.href && s.label !== "CV");

  return (
    <div className="animate-fade-up space-y-16">
      <div>
        <h1 className="display-tight text-3xl font-semibold">About</h1>
      </div>

      {/* TODO: 본인 사진으로 교체하거나, 사진을 안 쓸 거면 이 블록을 지우세요. */}
      <Image
        src={portrait}
        alt=""
        placeholder="blur"
        priority
        sizes="(min-width: 640px) 640px, 100vw"
        className="h-auto w-full rounded-md border border-hairline"
      />

      <div className="prose">
        <p>
          안녕하세요, {site.name}({site.nameKo})입니다. 현재 {site.affiliation}
          에서 {site.role}로 일하고 있습니다. DBpia의 논문들을 Agent 시스템에 맞춘 AI-ready 데이터로 구조화하고, AI 서비스를 발전시킵니다.
        </p>
        <p>
          관심 분야: Vision-Language Model, OCR, Chunking, RAG, Multi-Agent System, Embedding, Reranking
        </p>
      </div>

      <section>
        <SectionLabel>Elsewhere</SectionLabel>
        <ul className="-mx-3">
          {links.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                className="group flex items-baseline justify-between gap-4 rounded-md px-3 py-3 transition-colors hover:bg-surface"
              >
                <span className="text-sm text-foreground">{s.label}</span>
                <span className="truncate font-label text-xs text-faint transition-colors group-hover:text-accent">
                  {s.href.replace(/^https?:\/\/(www\.)?|^mailto:/, "")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
