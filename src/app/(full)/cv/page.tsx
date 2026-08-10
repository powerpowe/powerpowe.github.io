import type { Metadata } from "next";
import Image from "next/image";

import { CvNav, type CvSection } from "@/components/cv-nav";
import { EntryLogo } from "@/components/entry-logo";
import { PrintButton } from "@/components/print-button";
import { SectionLabel } from "@/components/section-label";
import { WorkList } from "@/components/work-list";
import {
  awards,
  education,
  experience,
  projects,
  publications,
  skills,
  summary,
  type CvEntry,
} from "@/lib/cv";
import { site } from "@/lib/site";

// TODO: 본인 증명사진으로 교체하세요.
import headshot from "@public/images/myphoto.jpg";

export const metadata: Metadata = {
  title: "CV",
  description: `${site.name} — ${site.role} at ${site.affiliation}. Curriculum vitae.`,
  alternates: { canonical: "/cv" },
};

function EntryList({ entries }: { entries: CvEntry[] }) {
  return (
    <ul className="space-y-7">
      {entries.map((entry) => (
        <li
          key={`${entry.period}-${entry.title}`}
          className="print-break-avoid flex flex-col gap-1 sm:flex-row sm:gap-4"
        >
          <span className="w-24 shrink-0 pt-0.5 font-label text-xs tabular-nums text-faint">
            {entry.period}
          </span>

          <div className="min-w-0">
            <EntryLogo
              src={entry.logo}
              org={entry.org}
              height={entry.logoHeight}
            />

            <h3 className="font-display font-medium leading-snug tracking-tight">
              {entry.href ? (
                <a
                  href={entry.href}
                  className="underline decoration-hairline underline-offset-4 transition-colors hover:text-accent"
                >
                  {entry.title}
                </a>
              ) : (
                entry.title
              )}
              <span className="text-muted"> · {entry.org}</span>
            </h3>
            {entry.location && (
              <p className="mt-0.5 font-label text-xs text-faint">
                {entry.location}
              </p>
            )}

            {entry.points && entry.points.length > 0 && (
              <ul className="mt-2.5 space-y-1.5">
                {entry.points.map((point) => (
                  <li
                    key={point}
                    className="relative pl-4 text-sm leading-relaxed text-muted before:absolute before:left-0 before:text-hairline before:content-['▸']"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    // scroll-mt clears the sticky header when the rail jumps here.
    <section id={id} className="print-break-avoid scroll-mt-24">
      <SectionLabel>{label}</SectionLabel>
      {children}
    </section>
  );
}

export default function CvPage() {
  // Built from the data so a section that renders nothing never shows up in
  // the rail. Order must match the render order below.
  const sections: CvSection[] = (
    [
      ["experience", "Experience", experience.length],
      ["education", "Education", education.length],
      ["projects", "Projects", projects.length],
      ["publications", "Publications", publications.length],
      ["skills", "Skills", skills.length],
      ["awards", "Awards", awards.length],
    ] as const
  )
    .filter(([, , count]) => count > 0)
    .map(([id, label]) => ({ id, label }));

  return (
    // The rail lives inside the page rather than the group layout because /about
    // has no sections to index. `print-reset` collapses the grid for printing,
    // where the rail is hidden anyway.
    <div className="print-reset lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-10">
      <CvNav sections={sections} />

      <div className="print-reset animate-fade-up space-y-14">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-[0.6875rem] uppercase tracking-[0.2em] text-faint">
              Curriculum Vitae
            </p>
            {/* The name is the heading here rather than "CV" so the printed
              document leads with it — the site header does not print. */}
            <h1 className="display-tight mt-2 text-3xl font-semibold">
              {site.name}
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              {site.role} · {site.affiliation}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-label text-xs text-faint">
              <a href={`mailto:${site.email}`} className="hover:text-accent">
                {site.email}
              </a>
              {site.links.github && (
                <a href={site.links.github} className="hover:text-accent">
                  {site.links.github.replace(/^https?:\/\//, "")}
                </a>
              )}
              {site.links.linkedin && (
                <a href={site.links.linkedin} className="hover:text-accent">
                  {site.links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-start gap-4">
            {/* Headshot. Unlike the Print button it is not `.no-print` — a Korean
              CV usually carries one on the printed copy too. Delete this block
              if you would rather not have a photo. */}
            {/* Its own proportions, not a square crop. Both axes are capped so
                the header cannot be blown apart by whatever file is dropped in:
                a 3:4 증명사진 ends up height-limited at 120x160, a wide photo
                width-limited. Change the two caps to resize. */}
            <Image
              src={headshot}
              alt={`${site.name} 프로필 사진`}
              placeholder="blur"
              sizes="160px"
              className="hidden h-auto max-h-40 w-auto max-w-32 rounded-md border border-hairline sm:block"
            />
            <PrintButton />
          </div>
        </div>

        <p className="max-w-prose leading-relaxed text-muted">{summary}</p>

        {experience.length > 0 && (
          <Section id="experience" label="Experience">
            <EntryList entries={experience} />
          </Section>
        )}

        {education.length > 0 && (
          <Section id="education" label="Education">
            <EntryList entries={education} />
          </Section>
        )}

        {projects.length > 0 && (
          <Section id="projects" label="Projects">
            <WorkList works={projects} />
          </Section>
        )}

        {publications.length > 0 && (
          <Section id="publications" label="Publications">
            <WorkList works={publications} />
          </Section>
        )}

        {skills.length > 0 && (
          <Section id="skills" label="Skills">
            <ul className="space-y-4">
              {skills.map((group) => (
                <li
                  key={group.group}
                  className="print-break-avoid flex flex-col gap-1 sm:flex-row sm:gap-4"
                >
                  <span className="w-24 shrink-0 font-label text-xs leading-6 text-faint">
                    {group.group}
                  </span>
                  <span className="text-sm leading-6 text-muted">
                    {group.items.join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {awards.length > 0 && (
          <Section id="awards" label="Awards">
            <EntryList entries={awards} />
          </Section>
        )}
      </div>
    </div>
  );
}
