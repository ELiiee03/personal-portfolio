"use client";

import React, { useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { Hero } from "@/components/hero";
import { Experience, Projects, Skills, Education } from "@/components/sections";
import { Chatbot } from "@/components/chatbot";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { GITHUB_PROFILE_URL, LINKEDIN_PROFILE_URL } from "@/lib/social-links";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-clip bg-lc-surface text-foreground selection:bg-accent/35 selection:text-accent-foreground md:pl-[72px]">
      <SidebarNav onChatToggle={() => setIsChatOpen(!isChatOpen)} />
      
      <Hero onChatToggle={() => setIsChatOpen(true)} />
      
      <div className="relative z-10 space-y-0">
        <Experience />
        <Skills />
        <Projects />
        <Education />
      </div>

      <footer id="contact" className="py-24 px-6 md:px-12 lg:px-24 border-t border-lc-border bg-lc-surface-2">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="ats-header">// CONTACT_SYS</div>
            <h2 className="font-headline text-3xl mb-6">Let's build something agentic.</h2>
            <div className="space-y-4">
              <a href="mailto:lieca.eleccion03@gmail.com" className="flex items-center gap-4 text-muted-foreground hover:text-lc-primary transition-colors group">
                <div className="w-10 h-10 bg-lc-surface border border-lc-border flex items-center justify-center rounded group-hover:border-lc-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-code text-sm">lieca.eleccion03@gmail.com</span>
              </a>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 bg-lc-surface border border-lc-border flex items-center justify-center rounded">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-code text-sm">Butuan City, Agusan del Norte, PH</span>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="p-2 border border-lc-border hover:border-lc-primary text-muted-foreground hover:text-lc-primary transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href={LINKEDIN_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="p-2 border border-lc-border hover:border-lc-primary text-muted-foreground hover:text-lc-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-end items-start md:items-end">
             <div className="bg-lc-surface border border-lc-border p-8 w-full max-w-sm">
                <div className="font-headline text-[10px] text-muted-foreground uppercase tracking-widest mb-4">Portfolio Metadata</div>
                <div className="space-y-2 text-[10px] font-code text-muted-foreground/60">
                   <div className="flex justify-between"><span>VERSION</span> <span className="text-lc-primary">2.5.0-STABLE</span></div>
                   <div className="flex justify-between"><span>ENGINE</span> <span className="text-lc-primary">NEXT.JS 14</span></div>
                   <div className="flex justify-between"><span>STYLES</span> <span className="text-lc-primary">TAILWIND_SHADCN</span></div>
                   <div className="flex justify-between"><span>STATUS</span> <span className="text-lc-warning">OPEN_TO_WORK</span></div>
                </div>
             </div>
             <p className="mt-8 font-headline text-[10px] text-muted-foreground tracking-widest uppercase">
               Built by Elliee © 2025 | All Rights Reserved
             </p>
          </div>
        </div>
      </footer>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
}