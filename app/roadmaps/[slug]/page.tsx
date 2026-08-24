import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoadmapBySlug, getAllRoadmaps } from "@/lib/mdx";
import type { CSSProperties } from "react";

export async function generateStaticParams() {
  const roadmaps = await getAllRoadmaps();
  return roadmaps.map((roadmap) => ({ slug: roadmap.slug }));
}

export default async function RoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = await getRoadmapBySlug(slug);
  if (!roadmap) notFound();

  return (
    <main className="edition-shell">
      <div className="edition-frame">
        <header className="edition-masthead">
          <Link className="edition-brand" href="/">
            <span className="edition-mark" aria-hidden="true">RR</span>
            <span>REFERENCE / RAIL</span>
          </Link>
          <div className="edition-meta">
            <span>FIELD SHEET / {roadmap.slug.toUpperCase()}</span>
            <span>STATIC MDX</span>
          </div>
        </header>

        <article className="edition-detail">
          <Link className="edition-back" href="/roadmaps">Back to route index</Link>
          <div className="edition-detail-intro">
            <div>
              <p className="edition-detail-label">FIELD SHEET / {roadmap.category}</p>
              <h1>{roadmap.title}</h1>
              <div className="edition-route-meta edition-detail-meta">
                <span>{roadmap.difficulty}</span>
                <span>{roadmap.estimated_time}</span>
                <span>{roadmap.stages.length} stages</span>
              </div>
            </div>
            <div className="edition-detail-progress">
              <span>MARKED</span>
              <strong>{roadmap.progress}%</strong>
              <span className="edition-progress-line">
                <span style={{ "--progress": roadmap.progress + "%" } as CSSProperties} />
              </span>
            </div>
          </div>

          <section className="edition-prerequisites" aria-labelledby="prerequisites-title">
            <h2 id="prerequisites-title">Before this route</h2>
            <div>
              {roadmap.prerequisites.length
                ? roadmap.prerequisites.map((item, index) => <span key={index}>{item}</span>)
                : <span>No prerequisites listed.</span>}
            </div>
          </section>

          <section className="edition-stages" aria-labelledby="stages-title">
            <div className="edition-section-head">
              <span className="edition-index">A / STAGES</span>
              <span>Read in order, revisit as needed</span>
            </div>
            <h2 id="stages-title">Walk the sequence.</h2>
            <ol>
              {roadmap.stages.map((stage, stageIndex) => (
                <li key={stageIndex} className="edition-stage">
                  <span className="edition-stage-number">{String(stageIndex + 1).padStart(2, "0")}</span>
                  <span className="edition-stage-rail" aria-hidden="true" />
                  <div className="edition-stage-body">
                    <h3>{stage.name}</h3>
                    <ul>
                      {stage.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <p className="edition-detail-note">
            This sheet is authored content from the repository. The marked progress
            is reference metadata, not a synced personal record.
          </p>
        </article>

        <footer className="edition-footer">
          <span>BOOK / DEV TOOLS</span>
          <span>READ · TRACE · CONTINUE</span>
        </footer>
      </div>
    </main>
  );
}
