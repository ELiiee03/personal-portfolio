"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Cpu, 
  Terminal, 
  GraduationCap, 
  Trophy, 
  ExternalLink,
  Github,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const EXPERIENCE = [
  {
    role: "Agentic AI Engineer",
    company: "MyRepsoft Limited",
    period: "Jul 2024 – Apr 2026",
    bullets: [
      "Architected Agentic RAG system using LangChain and LangGraph for educational question generation — 60% improvement in learning outcome consistency",
      "Built a natural language SQL agent translating plain-English queries to optimized SQL",
    ],
  },
  {
    role: "AI Automation Engineer",
    company: "Self-taught / Freelance",
    period: "Nov 2024 – Present",
    bullets: [
      "Designed AI-powered content generation workflows using n8n, OpenAI GPT, and Gmail APIs",
      "Automated end-to-end content creation and distribution pipelines",
    ],
  },
  {
    role: "Web Developer Intern",
    company: "Butuan City Tourism Department",
    period: "Feb 2025 – May 2025",
    bullets: [
      "Built QR code-based attendance scanning system for Cinema Rehiyon cultural film event",
    ],
  },
  {
    role: "AI & Mobile Developer",
    company: "Exon",
    period: "Jun 2024 – Apr 2025",
    bullets: [
      "Computer vision forgery detection system using SVM + MobileNetV3",
      "Full-stack e-commerce platform for local Butuan City artisans",
      "Database architecture for a job listing platform",
    ],
  },
];

const PROJECTS = [
  {
    title: "Agentic RAG System",
    status: "DEPLOYED",
    image: PlaceHolderImages.find(i => i.id === "rag-project")!,
    stack: "LangGraph, LangChain, FastAPI, MongoDB, Python",
    description: "Multi-step reasoning pipeline with MongoDB knowledge base and performance logging.",
    github: "https://github.com/ELiiee03/Cincinnati-Hotel",   // <-- add this
    demo: "https://cincinnati-hotel-weld.vercel.app",  // leave empty if no live demo
  },
  {
    title: "SQL Agent",
    status: "ACTIVE",
    image: PlaceHolderImages.find(i => i.id === "sql-agent")!,
    stack: "LangGraph, LangChain, FastAPI, SQLite, Python",
    description: "NL-to-SQL translation using LangChain agents with automated validation.",
    github: "https://github.com/ELiiee03/SQL-Agent",
    demo: "",
  },
  {
    title: "LeafSense",
    status: "THESIS",
    image: PlaceHolderImages.find(i => i.id === "leafsense")!,
    stack: "PyTorch, MobileNet, Flask, Vue.js, Supabase",
    description: "Mobile leaf identification app with 81% accuracy using MobileNet.",
    github: "https://github.com/ELiiee03/LeafSense.git",
    demo: "",
  },
];

const SKILL_CATEGORIES = [
  {
    name: "Agentic AI & Orchestration",
    skills: ["LangChain", "LangGraph", "MCP Servers", "Multi-agents", "LLM Orchestration"],
  },
  {
    name: "Vector Databases",
    skills: ["ChromaDB", "Pinecone", "Qdrant"],
  },
  {
    name: "AI Engineering",
    skills: ["RAG Systems", "Prompt Engineering", "Context Engineering", "Ollama", "RAGAS", "LangSmith"],
  },
  {
    name: "ML Frameworks",
    skills: ["PyTorch", "TensorFlow", "Scikit-learn", "MobileNetV3", "SVM"],
  },
  {
    name: "Backend",
    skills: ["FastAPI", "Flask", "Node.js", "PostgreSQL", "MongoDB", "Supabase", "SQLite"],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="ats-header">// EXPERIENCE</div>
      <div className="space-y-6">
        {EXPERIENCE.map((job, i) => (
          <div key={i} className="ats-panel group hover:border-accent/40 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-headline text-3xl text-foreground group-hover:text-accent transition-colors">{job.role}</h3>
                <p className="font-headline text-base text-muted-foreground tracking-tight">{job.company}</p>
              </div>
              <div className="bg-lc-surface border border-lc-border rounded px-4 py-1.5 text-sm font-headline text-muted-foreground uppercase">
                {job.period}
              </div>
            </div>
            <ul className="space-y-2">
              {job.bullets.map((bullet, j) => (
                <li key={j} className="flex gap-3 text-lg text-foreground/80 font-body leading-relaxed">
                  <span className="text-accent mt-1 flex-shrink-0"><ChevronRight className="w-3 h-3" /></span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24 bg-lc-surface-2/20">
      <div className="ats-header">// PROJECTS</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((project, i) => (
          <div key={i} className="ats-panel p-0 group overflow-hidden hover:border-accent/50 transition-all flex flex-col">
            <div className="relative h-48 w-full overflow-hidden">
               <Image 
                src={project.image.imageUrl} 
                alt={project.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                data-ai-hint={project.image.imageHint}
              />
               <div className="absolute top-4 right-4">
                 <Badge variant="outline" className="bg-lc-surface border-accent text-accent font-headline text-[9px] uppercase tracking-widest px-2 py-0.5 shadow-xl">
                   {project.status}
                 </Badge>
               </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-headline text-2xl text-foreground mb-3">{project.title}</h3>
              <p className="text-base text-muted-foreground font-body mb-4 flex-1">{project.description}</p>
              <div className="mt-auto space-y-4">
                <div className="font-code text-sm text-accent border-t border-lc-border pt-4">
                  {project.stack}
                </div>
                <div className="flex gap-2">
                   {project.github && (
                     <Button variant="ghost" size="sm" asChild className="h-9 text-sm uppercase font-headline tracking-widest gap-2 hover:text-accent">
                       <a href={project.github} target="_blank" rel="noopener noreferrer">
                         <Github className="w-4 h-4" /> Code
                       </a>
                     </Button>
                   )}
                   {project.demo && (
                     <Button variant="ghost" size="sm" asChild className="h-9 text-sm uppercase font-headline tracking-widest gap-2 hover:text-accent">
                       <a href={project.demo} target="_blank" rel="noopener noreferrer">
                         <ExternalLink className="w-4 h-4" /> Demo
                       </a>
                     </Button>
                   )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="ats-header">// SKILLS</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILL_CATEGORIES.map((cat, i) => (
          <div key={i} className="ats-panel">
            <div className="font-headline text-base text-muted-foreground uppercase tracking-widest mb-4 border-b border-lc-border pb-3">
              {cat.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill, j) => (
                <Badge 
                  key={j} 
                  variant="outline" 
                  className="rounded-none border-lc-border hover:border-accent hover:bg-accent/5 text-foreground font-body text-sm cursor-default transition-all py-1.5 px-3"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-lc-surface-2/20">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="ats-header">// EDUCATION</div>
            <div className="ats-panel">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-accent/10 rounded border border-accent/20 text-accent">
                   <GraduationCap className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-headline text-2xl text-foreground">BS Information Technology</h3>
                    <p className="font-headline text-base text-muted-foreground uppercase tracking-tight mb-4">Caraga State University | 2021 – 2025</p>
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                         <span className="font-headline text-sm text-muted-foreground uppercase tracking-widest">Performance Score (GPA)</span>
                         <span className="font-code text-accent text-lg">1.71 / 5.0 (Cum Laude)</span>
                       </div>
                       <Progress value={85} className="h-1 bg-lc-surface border border-lc-border" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
          <div>
            <div className="ats-header">// ACHIEVEMENTS</div>
            <div className="space-y-4">
              <div className="ats-panel flex gap-4 items-center">
                 <Trophy className="w-8 h-8 text-lc-warning flex-shrink-0" />
                 <div>
                    <h4 className="font-headline text-xl text-foreground">3rd Place — AI Frontiers Hackathon 2025</h4>
                    <p className="text-base text-muted-foreground font-body">ICT Davao MSME Edition — Highest overall technical score.</p>
                 </div>
              </div>
              <div className="ats-panel flex gap-4 items-center">
                 <Badge className="bg-accent text-primary-foreground font-headline text-[10px] h-8 w-8 flex items-center justify-center p-0 rounded-md">CS</Badge>
                 <div>
                    <h4 className="font-headline text-xl text-foreground">Civil Service Eligible</h4>
                    <p className="text-base text-muted-foreground font-body">Granted via PD 907 (Honor Graduate Eligibility).</p>
                 </div>
              </div>
            </div>
          </div>
       </div>
    </section>
  );
}