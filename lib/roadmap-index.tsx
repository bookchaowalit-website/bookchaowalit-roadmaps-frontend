import Link from "next/link";
import { getAllRoadmaps } from "./mdx";
import type { CSSProperties } from "react";

type RoadmapIndexProps = {
  title: string;
  description: string;
};

export async function RoadmapIndex({ title, description }: RoadmapIndexProps) {
  const roadmaps = await getAllRoadmaps();

  return (
    <main className="edition-shell">
      <div className="edition-frame">
        <header className="edition-masthead">
          <Link className="edition-brand" href="/">
            <span className="edition-mark" aria-hidden="true">RR</span>
            <span>REFERENCE / RAIL</span>
          </Link>
          <div className="edition-meta">
            <span>FIELD EDITION 01</span>
            <span>STATIC MDX</span>
          </div>
        </header>

        <section className="edition-hero">
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="edition-legend">
            <span className="edition-legend-line" aria-hidden="true" />
            <span>One rail<br />per route.</span>
          </div>
        </section>

        <section className="edition-route-section" aria-labelledby="route-list-title">
          <div className="edition-section-head">
            <span className="edition-index">A / ROUTES</span>
            <span>{roadmaps.length.toString().padStart(2, "0")} authored paths</span>
          </div>
          <div className="edition-route-heading">
            <h2 id="route-list-title">Choose a route.</h2>
            <span>Each sheet is a sequence, not a promise of instant fluency.</span>
          </div>
          <ol className="edition-route-list">
            {roadmaps.map((roadmap, index) => (
              <li key={roadmap.slug}>
                <Link className="edition-route-entry" href={"/roadmaps/" + roadmap.slug}>
                  <span className="edition-route-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="edition-route-rail" aria-hidden="true" />
                  <span className="edition-route-body">
                    <span className="edition-route-top">
                      <strong>{roadmap.title}</strong>
                      <span className="edition-route-arrow">Open sheet</span>
                    </span>
                    <span className="edition-route-meta">
                      <span>{roadmap.category}</span>
                      <span data-level={roadmap.difficulty}>{roadmap.difficulty}</span>
                      <span>{roadmap.estimated_time}</span>
                    </span>
                    <span className="edition-progress-line">
                      <span
                        style={{ "--progress": roadmap.progress + "%" } as CSSProperties}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="edition-route-foot">
                      <span>{roadmap.stages.length} stages / {roadmap.prerequisites.length} prerequisites</span>
                      <span>{roadmap.progress}% marked</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="edition-note">
          <span className="edition-note-mark" aria-hidden="true">§</span>
          <p>
            These are authored field notes held in the repository. Progress is
            sample metadata; there is no account, sync layer, or live market feed
            behind the marks.
          </p>
        </section>

        <footer className="edition-footer">
          <span>BOOK / DEV TOOLS</span>
          <span>READ · TRACE · CONTINUE</span>
        </footer>
      </div>
    </main>
  );
}
