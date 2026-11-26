"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDownLeft, X } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import { LiveClock } from "./LiveClock";
import { SocialIcon } from "./SocialIcons";

const navLinks = [
  { index: "01", label: "Home", href: "#hero" },
  { index: "02", label: "The Business Side", href: "#business" },
  { index: "03", label: "Beyond Business", href: "#beyond" },
];

export function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { identity, socials } = portfolioData;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToNext = () => {
    const el = document.getElementById("business");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section
        id="hero"
        className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden px-6 py-7 sm:px-10 sm:py-9 md:px-14 md:py-10"
      >
        {/* Full-bleed Background Portrait */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <Image
            src="/hero-portrait.png"
            alt={identity.fullName}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_20%] sm:object-[78%_center] lg:object-right"
          />
          {/* Left-side readability scrim + subtle top/bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/90 via-[#0e0e0e]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/85 via-transparent to-[#0e0e0e]/45" />
        </div>

        {/* Top Bar */}
        <header className="relative z-10 flex items-center justify-between gap-4">
          {/* Left: Name (always) + Subtitle (desktop only) */}
          <div className="flex items-center gap-6 sm:gap-10 md:gap-16">
            <a href="#hero" className="group block focus:outline-none">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-cream transition-opacity group-hover:opacity-80 sm:text-sm">
                {identity.fullName}
              </p>
              {/* Hide "PERSONAL WEBSITE" subtitle on mobile */}
              <p className="mt-0.5 hidden font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-cream-muted sm:block">
                {identity.topSubtitle}
              </p>
            </a>

            {/* Status Pill — desktop only (mobile pill is below) */}
            <div className="hidden items-center gap-2.5 rounded-full border border-cream/20 bg-obsidian/50 px-4 py-1.5 backdrop-blur-sm sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-cream/70" />
              <span className="font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-cream/90">
                {identity.pillText}
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Social icons: hidden on mobile, visible on sm+ */}
            <nav aria-label="Social links" className="hidden items-center gap-3 sm:flex sm:gap-4">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-cream/70 transition-colors hover:text-cream"
                >
                  <SocialIcon id={s.id} className="h-[17px] w-[17px]" />
                </a>
              ))}
            </nav>

            <span aria-hidden="true" className="hidden h-4 w-px bg-cream/15 sm:block" />

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="group flex h-11 w-11 cursor-pointer flex-col items-end justify-center gap-1.5 rounded-full border border-transparent transition-colors hover:border-cream/20 focus:outline-none focus-visible:border-cream/40"
            >
              <span className="mr-2.5 block h-[1.5px] w-6 bg-cream transition-transform duration-300 group-hover:translate-x-[-2px]" />
              <span className="mr-2.5 block h-[1.5px] w-6 bg-cream/85 transition-transform duration-300 group-hover:translate-x-[2px]" />
            </button>
          </div>
        </header>

        {/* Mobile-only: pill + socials row */}
        <div className="relative z-10 mt-3 flex items-center justify-between sm:hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-obsidian/65 px-3.5 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cream/75" />
            <span className="font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-cream/90">
              {identity.pillText}
            </span>
          </div>
          {/* Socials row on mobile, right-aligned */}
          <nav aria-label="Social links" className="flex items-center gap-2.5">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 transition-colors hover:text-cream"
              >
                <SocialIcon id={s.id} className="h-[15px] w-[15px]" />
              </a>
            ))}
          </nav>
        </div>

        {/* Centerpiece — big name */}
        <div className="relative z-10 my-auto py-6 sm:py-10">
          <div className="w-full md:max-w-[72%]">
            <h1 className="font-display font-normal uppercase tracking-[0.015em] text-[#EDE9E0] select-none">
              <span className="animate-rise-1 block text-[clamp(4.8rem,12.8vw,12.25rem)] leading-[0.95]">
                {identity.firstName}
              </span>
              <span className="animate-rise-2 mt-2 block pl-[10%] text-[clamp(4.8rem,12.8vw,12.25rem)] leading-[0.95] sm:mt-4 sm:pl-[18%] md:pl-[20%]">
                {identity.lastName}
              </span>
            </h1>
          </div>
        </div>

        {/* Bottom Metadata Strip */}
        <footer className="animate-rise-3 relative z-10 flex flex-col gap-4 pt-2 md:flex-row md:items-end md:justify-between sm:gap-6 sm:pt-4">
          {/* Mobile: 2-col grid for metadata; desktop: 3-col flex */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:flex md:items-stretch md:gap-0">
            <div className="md:border-r md:border-cream/15 md:pr-8 lg:pr-12">
              <p className="font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-cream-muted">
                {identity.basedInLabel}
              </p>
              <p className="mt-1 font-sans text-xs font-normal text-cream/95 sm:text-sm">
                {identity.city}
              </p>
            </div>

            <div className="md:border-r md:border-cream/15 md:px-8 lg:px-12">
              <p className="font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-cream-muted">
                {identity.currentlyLabel}
              </p>
              <p className="mt-1 font-sans text-xs font-normal text-cream/95 sm:text-sm">
                {identity.currentlyValue}
              </p>
            </div>

            {/* "Interested in" spans full width on mobile so it's not squished */}
            <div className="col-span-2 sm:col-span-1 md:pl-8 lg:pl-12">
              <p className="font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-cream-muted">
                {identity.interestedInLabel}
              </p>
              <p className="mt-1 font-sans text-xs font-normal text-cream/95 sm:text-sm">
                {identity.interestedInValue}
              </p>
            </div>
          </div>

          {/* Circular Scroll CTA */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={scrollToNext}
              aria-label="Scroll to The Business Side"
              className="group flex h-20 w-20 cursor-pointer items-center justify-center gap-1 rounded-full border border-cream/35 bg-obsidian/30 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-cream backdrop-blur-xs transition-all duration-300 hover:scale-105 hover:border-cream hover:bg-cream hover:text-obsidian sm:h-24 sm:w-24"
            >
              <span>SCROLL</span>
              <ArrowDownLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
            </button>
          </div>
        </footer>
      </section>

      {/* Full-Screen Editorial Navigation Overlay */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-obsidian/98 px-6 py-8 backdrop-blur-md sm:px-10 md:px-14"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted">
              Navigation
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:bg-cream hover:text-obsidian"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="my-auto flex flex-col gap-3 sm:gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-baseline gap-4 border-b border-cream/10 py-3 transition-colors hover:border-cream/35"
              >
                <span className="font-mono text-xs text-cream-muted transition-colors group-hover:text-emerald-live">
                  {link.index}
                </span>
                <span className="font-display text-4xl uppercase tracking-tight text-cream transition-transform duration-300 group-hover:translate-x-3 sm:text-6xl">
                  {link.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-cream-muted">
            <span>
              {identity.city} — <LiveClock timezone={identity.timezone} /> IST
            </span>
            <div className="flex items-center gap-5">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="inline-flex items-center gap-2 transition-colors hover:text-cream"
                >
                  <SocialIcon id={s.id} className="h-4 w-4" />
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
