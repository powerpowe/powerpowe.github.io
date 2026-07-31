import type { Metadata } from "next";
import Image from "next/image";

import { SectionLabel } from "@/components/section-label";
import { site, socials } from "@/lib/site";

// A static import gives next/image the dimensions for free and lets it build a
// blur placeholder. Drop a file in public/images/ and point this at it.
import portrait from "@public/images/placeholder.png";

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
          에서 {site.role}로 일하고 있습니다.
        </p>
        <p>
          학술 논문 검색 서비스를 만들면서 검색 품질, 색인 파이프라인, 메타데이터
          정규화 같은 문제를 다룹니다. 논문을 읽고 나면 잊어버리는 게 아까워서
          이곳에 정리해 두고 있습니다.
        </p>
        <p>
          TODO: 이 문단을 본인 소개로 바꿔주세요. 어떤 문제에 관심이 있는지, 어떤
          걸 만들어 왔는지, 어떤 이야기를 나누고 싶은지 적으면 좋습니다.
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
