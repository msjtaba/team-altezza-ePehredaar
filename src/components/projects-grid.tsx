"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/project-card";
import { ProjectDrawer, type DrawerProject } from "@/components/project-drawer";

/**
 * Owns the completed-project side-drawer state for the Projects tab
 * (changes-1.md §4) — a client boundary so the listing/filters above it can
 * stay server-rendered. Each project already carries everything the drawer
 * needs (contractor name, lat/lng, payments) so opening it is instant, no
 * extra fetch.
 */
export function ProjectsGrid({ projects }: { projects: DrawerProject[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = projects.find((p) => p.id === selectedId) ?? null;

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 6) * 60}>
            <ProjectCard
              project={{
                id: p.id,
                title: p.title,
                category: p.category,
                status: p.status,
                sanctionedAmount: p.sanctionedAmount,
                mp: p.mp,
                district: p.district,
              }}
              onOpen={setSelectedId}
            />
          </Reveal>
        ))}
      </div>

      <ProjectDrawer project={selected} onClose={() => setSelectedId(null)} />
    </>
  );
}
