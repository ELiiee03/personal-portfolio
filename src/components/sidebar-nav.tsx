"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowUpRight, Briefcase, Cpu, FolderKanban, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  { id: "experience", label: "EXPERIENCE", Icon: Briefcase    },
  { id: "skills",     label: "SKILLS",     Icon: Cpu          },
  { id: "projects",   label: "PROJECTS",   Icon: FolderKanban },
  { id: "contact",    label: "CONTACT",    Icon: Mail         },
];

type SectionId = "experience" | "projects" | "skills" | "contact";

interface SidebarNavProps {
  onChatToggle: () => void;
}

const NODE_SIZE = 38; // px — circle diameter

export function SidebarNav({ onChatToggle }: SidebarNavProps) {
  const [activeSection, setActiveSection]   = useState<SectionId | "">("");
  const [hoveredNode, setHoveredNode]       = useState<SectionId | null>(null);
  const [fillPct, setFillPct]               = useState(0);
  const [trackPxHeight, setTrackPxHeight]   = useState(0);
  const trackRef                            = useRef<HTMLDivElement>(null);

  // ── IntersectionObserver (unchanged) ─────────────────────────────────────
  useEffect(() => {
    const els = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      { threshold: [0, 0.3, 0.5, 1], rootMargin: "0px 0px -20% 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Derive fill percentage from active section index (unchanged)
  useEffect(() => {
    const idx = NAV_SECTIONS.findIndex((s) => s.id === activeSection);
    setFillPct(idx < 0 ? 0 : (idx / (NAV_SECTIONS.length - 1)) * 100);
  }, [activeSection]);

  // ── Track pixel height — updates on mount and viewport resize ──────────
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setTrackPxHeight(trackRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ── Scroll helper (unchanged) ─────────────────────────────────────────────
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const activeIdx  = NAV_SECTIONS.findIndex((s) => s.id === activeSection);
  // Fill height in px: derived from the track element's measured offsetHeight
  const trackLength = Math.max(0, trackPxHeight - NODE_SIZE);
  const fillHeight  = (fillPct / 100) * trackLength;

  return (
    <>
      {/* ─── Desktop: compact frosted-glass pill ─────────────────────────── */}
      <aside
        aria-label="Page navigation"
        className="fixed z-[100] hidden md:flex flex-col items-center rounded-2xl"
        style={{
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "64px",
          padding: "18px 0",
          gap: "12px",
          background: "transparent",
          border: "none",
          boxShadow: "none",
        }}
      >
        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-0.5 select-none">
          <div className="font-headline text-[11px] font-bold tracking-widest text-lc-primary bg-accent/10 border border-accent/40 px-2 py-0.5 rounded-sm">
            LJE
          </div>
          <div className="font-headline text-[7px] text-muted-foreground/60 tracking-[0.12em] uppercase text-center leading-tight mt-0.5">
            SYS_v0.5
          </div>
        </div>

        {/* ── Track + Icon Nodes ────────────────────────────────────────── */}
        <div
          ref={trackRef}
          className="relative flex flex-col items-center justify-between"
          style={{ height: "60vh", width: "100%" }}
        >
          {/* Track: unfilled background */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[2px] rounded-full"
            style={{
              top: `${NODE_SIZE / 2}px`,
              height: `calc(60vh - ${NODE_SIZE}px)`,
              background: "hsl(220 38% 88% / 0.9)",
            }}
          />

          {/* Track: accent fill, animates with scroll */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[2px] rounded-full sidebar-fill-bar"
            style={{
              top: `${NODE_SIZE / 2}px`,
              height: `${fillHeight}px`,
              background: "hsl(var(--lc-primary))",
            }}
          />

          {/* Nodes */}
          {NAV_SECTIONS.map((section, i) => {
            const { Icon } = section;
            const isActive = activeSection === section.id;
            const isPast   = activeIdx > i;
            const isHov    = hoveredNode === section.id;

            return (
              <div key={section.id} className="relative flex items-center justify-center z-10">
                {/* Label slides in from the right on hover */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute font-headline text-[9px] tracking-[0.15em] uppercase whitespace-nowrap pointer-events-none",
                    "transition-all duration-200 ease-out",
                    isHov ? "opacity-100 text-lc-primary" : "opacity-0 text-muted-foreground"
                  )}
                  style={{
                    left: `calc(50% + ${NODE_SIZE / 2 + 8}px)`,
                    transform: isHov ? "translateX(0)" : "translateX(-4px)",
                  }}
                >
                  {section.label}
                </span>

                {/* Icon node button */}
                <button
                  onClick={() => scrollTo(section.id)}
                  onMouseEnter={() => setHoveredNode(section.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  aria-label={`Navigate to ${section.label}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 cursor-pointer focus:outline-none",
                    "transition-all duration-300 ease-out",
                    isActive
                      ? "bg-lc-primary border-lc-primary sidebar-node-active scale-105"
                      : isPast
                      ? "bg-lc-primary/15 border-lc-primary/40"
                      : "bg-transparent border-muted-foreground/25 hover:border-lc-primary/55",
                    isHov && !isActive && "scale-[1.15]"
                  )}
                  style={{
                    width: `${NODE_SIZE}px`,
                    height: `${NODE_SIZE}px`,
                    boxShadow: isActive
                      ? "0 0 10px hsl(251 56% 45% / 0.45)"
                      : undefined,
                  }}
                >
                  <Icon
                    className={cn(
                      "transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : isPast
                        ? "text-lc-primary/60"
                        : "text-muted-foreground/45"
                    )}
                    style={{ width: "16px", height: "16px" }}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Chat button ───────────────────────────────────────────────── */}
        <button
          onClick={onChatToggle}
          className="group flex flex-col items-center gap-1 focus:outline-none"
          aria-label="Open chat with Ellie"
        >
          <div className="w-9 h-9 rounded-full border border-lc-primary/30 bg-accent/10 flex items-center justify-center transition-all duration-200 group-hover:bg-lc-primary group-hover:border-lc-primary group-hover:scale-105">
            <ArrowUpRight className="w-4 h-4 text-lc-primary group-hover:text-white transition-colors" />
          </div>
          <span className="font-headline text-[7px] text-muted-foreground/55 tracking-widest uppercase">
            ELLIE
          </span>
        </button>
      </aside>

      {/* ─── Mobile: frosted bottom bar with icon nodes ───────────────────── */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-between px-5 py-2.5"
        style={{
          background: "rgba(251, 251, 253, 0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderTop: "1px solid rgba(200, 195, 230, 0.55)",
          boxShadow: "0 -2px 16px rgba(90, 70, 180, 0.07)",
        }}
      >
        {/* Logo */}
        <div className="font-headline text-[10px] font-bold text-lc-primary bg-accent/10 border border-accent/40 px-2 py-0.5 rounded-sm tracking-widest select-none">
          LJE
        </div>

        {/* Icon nodes row */}
        <div className="flex items-center gap-3">
          {NAV_SECTIONS.map((section) => {
            const { Icon } = section;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                aria-label={section.label}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "flex items-center justify-center rounded-full border-2 cursor-pointer focus:outline-none",
                  "transition-all duration-300 ease-out",
                  isActive
                    ? "bg-lc-primary border-lc-primary sidebar-node-active"
                    : "bg-transparent border-muted-foreground/25 hover:border-lc-primary/50"
                )}
                style={{
                  width: "34px",
                  height: "34px",
                  boxShadow: isActive ? "0 0 10px hsl(251 56% 45% / 0.4)" : undefined,
                }}
              >
                <Icon
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-white" : "text-muted-foreground/50"
                  )}
                  style={{ width: "15px", height: "15px" }}
                />
              </button>
            );
          })}
        </div>

        {/* Chat pill */}
        <button
          onClick={onChatToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-lc-primary/30 bg-accent/10 text-lc-primary font-headline text-[9px] tracking-widest uppercase hover:bg-lc-primary hover:text-white hover:border-lc-primary transition-all duration-200"
          aria-label="Open chat with Ellie"
        >
          ELLIE <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </>
  );
}
