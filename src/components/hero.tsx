"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, type Transition } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check, MessageSquare, Github, Linkedin } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { GITHUB_PROFILE_URL, LINKEDIN_PROFILE_URL } from "@/lib/social-links";
import { cn } from "@/lib/utils";

const ROLES = [
  "Agentic AI Engineer",
  "RAG Developer",
  "LLM Systems Architect",
  "AI Automation Engineer",
  "Generative AI Engineer",
];

const TECH_BADGES = ["LangGraph", "FastAPI", "RAG", "LangChain", "ChromaDB", "Python"];

const STATS = [
  { value: "3+", label: "AI Projects" },
  { value: "Cum Laude", label: "Honors" },
  { value: "Top 3", label: "Hackathon" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" } as Transition,
});

export function Hero({ onChatToggle }: { onChatToggle: () => void }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bubblePop, setBubblePop] = useState(false);
  const [heroFxVisible, setHeroFxVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const avatar = PlaceHolderImages.find(img => img.id === "avatar")!;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("lieca.eleccion03@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChatTrigger = () => {
    setBubblePop(true);
    setTimeout(() => {
      onChatToggle();
      setBubblePop(false);
    }, 300);
  };

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        if (displayText === currentRole) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        if (displayText === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => setHeroFxVisible(e.isIntersecting),
      { threshold: 0, rootMargin: "0px" }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Full-viewport hero canvas: pinned (does not scroll with document); clipped so it does not sit under the fixed sidebar */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[8] h-[100dvh] bg-[hsl(0,0%,98%)] md:[clip-path:inset(0_0_0_92px)]",
          heroFxVisible ? "block" : "hidden"
        )}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at center, rgb(180 180 210) 1.15px, transparent 1.15px)",
            backgroundSize: "24px 24px",
            opacity: 0.55,
          }}
        />
        <motion.div
          className="pointer-events-none absolute rounded-full blur-3xl max-md:right-[-18vw] md:right-[-8vw]"
          style={{
            top: "-8vh",
            width: "min(72vw, 520px)",
            height: "min(72vw, 520px)",
            background: "radial-gradient(circle, rgba(99,102,241,0.38) 0%, rgba(99,102,241,0.08) 42%, transparent 72%)",
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.82, 0.55] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute rounded-full blur-3xl max-md:left-[-14vw] md:left-[-6vw]"
          style={{
            bottom: "-6vh",
            width: "min(65vw, 440px)",
            height: "min(65vw, 440px)",
            background: "radial-gradient(circle, rgba(139,92,246,0.32) 0%, rgba(139,92,246,0.06) 45%, transparent 72%)",
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.78, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <section
        ref={sectionRef}
        className="relative z-[15] min-h-screen w-full max-w-none shrink-0 bg-transparent flex flex-col md:flex-row items-center pt-20 md:-ml-[72px] md:w-[calc(100%+72px)]"
      >

      {/* ── Left Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 z-10 px-6 md:pl-[calc(72px+3rem)] md:pr-12 lg:pl-[calc(72px+6rem)] lg:pr-24 flex flex-col justify-center gap-6">
        <div>

          {/* Open to Work badge */}
          <motion.div {...fadeUp(0.1)}>
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_8px_hsl(var(--lc-accent))]" />
              <span className="font-headline text-[10px] tracking-widest text-lc-primary uppercase font-bold">Open to Work</span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.div {...fadeUp(0.25)}>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter text-foreground mb-4">
              Lieca Jane<br />T. Eleccion
            </h1>
          </motion.div>

          {/* @elliee handle */}
          <motion.div {...fadeUp(0.35)}>
            <div className="bg-lc-surface-2 border border-lc-border rounded px-2 py-1 inline-block mb-6">
              <span className="font-code text-lc-primary text-sm tracking-tight">@elliee</span>
            </div>
          </motion.div>

          {/* Typewriter role */}
          <motion.div {...fadeUp(0.45)}>
            <div className="h-12 flex items-center">
              <span className="font-headline text-xl md:text-2xl text-lc-primary">
                {displayText}
              </span>
              <span className="text-indigo-500 font-code text-xl md:text-2xl ml-0.5 animate-[blink_1s_step-end_infinite]">|</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div {...fadeUp(0.55)}>
            <p className="max-w-md text-muted-foreground font-body text-lg leading-relaxed">
              Building agentic AI systems that reason, retrieve, and act.
            </p>
          </motion.div>

          {/* University line */}
          <motion.div {...fadeUp(0.62)}>
            <p className="max-w-md text-foreground/80 text-sm font-body mb-6">
              Cum Laude, BS Information Technology — Caraga State University.
            </p>
          </motion.div>

          {/* ── 5. Tech Stack Badges ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {TECH_BADGES.map((badge) => (
              <span
                key={badge}
                className="bg-indigo-50 border border-indigo-200 text-indigo-600 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full hover:bg-indigo-100 hover:scale-105 transition-all duration-200 cursor-default"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.75)}>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button size="lg" className="font-headline bg-accent hover:bg-lc-highlight text-primary-foreground rounded-none uppercase tracking-widest px-8">
                View Work
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onChatToggle}
                className="font-headline border-lc-border hover:border-accent hover:bg-accent/5 text-foreground rounded-none uppercase tracking-widest px-8"
              >
                Chat with Ellie
              </Button>
            </div>
          </motion.div>

          {/* ── 6. Stats Row ─────────────────────────────────────────────────── */}
          <motion.div {...fadeUp(0.85)}>
            <div className="flex items-center gap-4 flex-wrap">
              {STATS.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-indigo-600">{stat.value}</span>
                    <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  {i < STATS.length - 1 && (
                    <span className="text-gray-300 select-none">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Right Content — Candidate Card ─────────────────────────────────── */}
      <motion.div
        className="hidden md:flex flex-[0.7] z-10 px-12 border-l border-lc-border h-full flex-col justify-center items-center"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
      >
        <div className="relative overflow-visible w-full max-w-sm">

          {/* GitHub icon — top-left corner, half outside the card */}
          <motion.a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub profile (@elliee-eleccion)"
            className="absolute z-[15] flex h-10 w-10 items-center justify-center rounded-full bg-lc-surface-2/95 backdrop-blur-md border-2 border-[#C4B5FD] text-lc-primary shadow-[0_4px_12px_rgba(0,0,0,0.2)] cursor-pointer transition-all hover:scale-110"
            style={{ top: "-10px", left: "-75px" }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Github className="w-6 h-10 relative z-[1]" strokeWidth={2.25} />
            <svg
              className="pointer-events-none absolute left-1/2 top-full -mt-0.5 h-[64px] w-[104px] -translate-x-1/2 overflow-visible z-[20] text-[#C4B5FD] transition-colors duration-700"
              viewBox="0 0 76 48"
              aria-hidden
            >
              <path
                d="M 38 0 C 42 18 62 38 90 54"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="110"
                strokeDashoffset="0"
                style={{ animation: "strokeDraw 2.5s ease-in-out infinite" }}
              />
              <path
                d="M 90 54 L 86 45 M 90 54 L 80 55"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.a>

          {/* Chat with Ellie bubble */}
          {!bubblePop && (
            <div
              role="button"
              tabIndex={0}
              aria-label="Open chat with Ellie"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleChatTrigger();
                }
              }}
              onClick={handleChatTrigger}
              className={cn(
                "absolute z-[15] p-3.5 w-[200px] rounded-xl cursor-pointer transition-all hover:scale-105",
                "bg-lc-surface-2/95 backdrop-blur-md border-2 border-[#C4B5FD]",
                "shadow-[0_4px_16px_rgba(0,0,0,0.15)]",
                "animate-bubble-float",
                bubblePop ? "scale-0 opacity-0" : "scale-100 opacity-100"
              )}
              style={{ bottom: "calc(100% + 12px)", right: "-12px" }}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-accent/10 rounded-lg text-lc-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-headline text-sm text-foreground tracking-tight whitespace-nowrap">Chat with Ellie ✦</div>
                  <div className="font-body text-[9px] text-muted-foreground tracking-wide">Ask me anything →</div>
                </div>
              </div>
              <svg
                className="pointer-events-none absolute left-[42%] top-full -mt-1 h-[72px] w-[64px] -translate-x-1/2 overflow-visible z-[20] text-[#C4B5FD] transition-colors duration-700"
                viewBox="0 0 64 72"
                aria-hidden
              >
                <path
                  d="M 38 0 C 32 20 24 42 14 62"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="110"
                  strokeDashoffset="0"
                  style={{ animation: "strokeDraw 2.5s ease-in-out infinite" }}
                />
                <path
                  d="M 14 62 L 11 54 M 14 62 L 22 60"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          {/* LinkedIn icon — right edge */}
          <motion.a
            href={LINKEDIN_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open LinkedIn profile"
            className="absolute z-[15] flex h-11 w-11 items-center justify-center rounded-full bg-lc-surface-2/95 backdrop-blur-md border-2 border-[#C4B5FD] text-lc-primary shadow-[0_4px_12px_rgba(0,0,0,0.2)] cursor-pointer transition-all hover:scale-110"
            style={{ top: "40%", right: "-72px", transform: "translateY(-50%)" }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Linkedin className="w-5 h-5 relative z-[1]" strokeWidth={2.25} />
            <svg
              className="pointer-events-none absolute right-full top-1/2 -translate-y-[65%] mr-1 h-[72px] w-[110px] overflow-visible z-[20] text-[#C4B5FD] transition-colors duration-700"
              viewBox="0 0 100 50"
              aria-hidden
            >
              <path
                d="M 106 40 C 88 14 52 6 6 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="120"
                strokeDashoffset="0"
                style={{ animation: "strokeDraw 2.5s ease-in-out infinite" }}
              />
              <path
                d="M 6 32 L 16 33 M 6 32 L 10 23"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.a>

          {/* ── 7. Card — floating animation + shimmer ring ─────────────────── */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="ats-panel group/card !overflow-visible w-full max-w-sm p-8 bg-card/95 backdrop-blur-sm ring-1 ring-indigo-200/60 hover:ring-indigo-400/80 transition-all duration-500 !border-[#8B79E8]/60 shadow-[0_0_0_1px_rgba(139,121,232,0.4),0_0_28px_rgba(110,92,217,0.28),0_4px_20px_rgba(0,0,0,0.05)] z-[1]">
              <div className="ats-header !text-sm">Candidate Profile</div>

              <div className="relative mb-8 group">
                <div className="aspect-square rounded-2xl border-2 border-lc-border overflow-visible relative grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="absolute inset-0 z-0 rounded-2xl">
                    <Image
                      src={avatar.imageUrl}
                      alt={avatar.description}
                      fill
                      className="object-cover"
                      data-ai-hint={avatar.imageHint}
                    />
                    <div className="absolute inset-0 bg-accent/10 pointer-events-none mix-blend-overlay" />
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-accent text-primary-foreground font-headline text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(197,186,255,0.65),0_4px_14px_rgba(124,95,240,0.4)]">
                  PHOTO_v2.0
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-lc-border/50 pb-1 group/field">
                  <span className="font-headline text-[10px] text-muted-foreground uppercase tracking-widest">Location</span>
                  <span className="font-body text-xs text-foreground group-hover/field:text-lc-primary transition-colors">Butuan City, PH</span>
                </div>
                <div className="flex justify-between items-end border-b border-lc-border/50 pb-1 group/field">
                  <span className="font-headline text-[10px] text-muted-foreground uppercase tracking-widest">Phone</span>
                  <span className="font-body text-xs text-foreground group-hover/field:text-lc-primary transition-colors">+63 950 218 4401</span>
                </div>
                <div className="flex justify-between items-end border-b border-lc-border/50 pb-1 group/field relative">
                  <span className="font-headline text-[10px] text-muted-foreground uppercase tracking-widest">Email</span>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-xs text-foreground truncate max-w-[120px]">lieca.eleccion03@gmail.com</span>
                    <button onClick={handleCopyEmail} className="text-muted-foreground hover:text-lc-primary transition-colors p-1">
                      {copied ? <Check className="w-3 h-3 text-lc-primary" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-headline text-[10px] text-muted-foreground uppercase tracking-widest">Status</span>
                  <div className="bg-accent/10 text-lc-primary border border-accent/25 rounded-full px-2 py-0.5 font-headline text-[9px] font-bold uppercase tracking-wider shadow-[0_0_16px_rgba(197,186,255,0.45)]">
                    Actively Seeking
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* ── Mobile Profile Photo (Small Chip) ────────────────────────────────── */}
      <div className="md:hidden flex justify-center w-full mt-12 pb-12">
        <div className="bg-lc-surface-2 border border-lc-border p-3 flex items-center gap-4 rounded-xl relative">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-accent/50 grayscale">
            <Image src={avatar.imageUrl} alt={avatar.description} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-xs text-foreground">Lieca Jane</span>
            <span className="font-body text-[10px] text-muted-foreground">Agentic AI Engineer</span>
          </div>
          <button
            onClick={onChatToggle}
            className="absolute -top-4 -right-4 p-2 bg-accent rounded-full text-primary-foreground shadow-lg animate-bounce"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

    </section>
    </>
  );
}
