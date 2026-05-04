"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export function Navbar({ onChatToggle }: { onChatToggle: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 300;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-border py-3 shadow-xl" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <div className="bg-accent/10 border border-accent/20 rounded px-2 py-0.5 text-lc-primary font-headline text-sm font-bold group-hover:bg-accent group-hover:text-primary-foreground transition-colors">
            LJE
          </div>
          <span className="hidden sm:inline font-headline text-xs tracking-tighter text-muted-foreground group-hover:text-foreground transition-colors">
            SYSTEMS_v2.5
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "font-headline text-xs uppercase tracking-widest hover:text-lc-primary transition-colors relative py-1",
                activeSection === link.href.substring(1) ? "text-lc-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
              {activeSection === link.href.substring(1) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-lc-primary rounded-full" />
              )}
            </Link>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onChatToggle}
            className="font-headline text-xs border-lc-primary/35 hover:border-lc-primary hover:bg-accent/10 text-lc-primary gap-2"
          >
            Chat with Ellie <ArrowUpRight className="w-3 h-3" />
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-lc-surface-2 border-b border-border p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-headline text-sm uppercase tracking-widest text-muted-foreground hover:text-lc-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Button
            variant="outline"
            className="font-headline text-sm border-lc-primary/35 text-lc-primary justify-between"
            onClick={() => {
              setMobileMenuOpen(false);
              onChatToggle();
            }}
          >
            Chat with Ellie <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </header>
  );
}