"use client";

import { useEffect, useRef, useState } from "react";
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

const ANNOTATIONS = [
  {
    id: "student",
    title: "THE STUDENT",
    subtitle: "Academics and continuous learning.",
    // Desktop placement around centered portrait
    desktopPos: "left-[4%] lg:left-[8%] top-[18%] text-left max-w-[230px]",
    // Hand-drawn curved arrow + arrowhead in 1200x760 viewBox
    linePath: "M 275 180 C 335 168, 385 192, 432 232",
    headPath: "M 418 228 L 434 234 L 427 218",
  },
  {
    id: "builder",
    title: "THE BUILDER",
    subtitle: "AI, automation and entrepreneurship.",
    desktopPos: "right-[4%] lg:right-[8%] top-[20%] text-right max-w-[240px]",
    linePath: "M 922 195 C 860 182, 812 204, 766 244",
    headPath: "M 780 241 L 764 246 L 772 230",
  },
  {
    id: "curious",
    title: "THE CURIOUS MIND",
    subtitle: "Exploring ideas and understanding how things work.",
    desktopPos: "left-[4%] lg:left-[8%] bottom-[17%] text-left max-w-[250px]",
    linePath: "M 285 570 C 345 552, 392 505, 438 456",
    headPath: "M 424 461 L 440 454 L 434 470",
  },
  {
    id: "beyond",
    title: "BEYOND WORK",
    subtitle: "Fitness, discipline and personal growth.",
    desktopPos: "right-[4%] lg:right-[8%] bottom-[17%] text-right max-w-[240px]",
    linePath: "M 915 568 C 855 550, 808 504, 762 456",
    headPath: "M 776 460 L 760 454 L 766 470",
  },
] as const;

export function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { identity, socials } = portfolioData;

  const sectionRef = useRef<HTMLElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobilePillRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const portraitLayerRef = useRef<HTMLDivElement>(null);
  const introLabelRef = useRef<HTMLDivElement>(null);
  const desktopArrowRefs = useRef<(SVGPathElement | null)[]>([]);
  const desktopHeadRefs = useRef<(SVGPathElement | null)[]>([]);
  const desktopNoteRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileNoteRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const prepareStroke = (el: SVGPathElement | null) => {
        if (!el) return;
        const len = el.getTotalLength();
        gsap.set(el, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 1,
        });
      };

      const mm = gsap.matchMedia();
      cleanup = () => mm.revert();

      // ─── Desktop & Tablet (>= 768px) ────────────────────────────────
      mm.add("(min-width: 768px)", () => {
        gsap.set(portraitLayerRef.current, {
          opacity: 0,
          x: "22vw",
          y: "3vh",
          scale: 1.14,
        });
        gsap.set(introLabelRef.current, { opacity: 0, y: 8 });
        desktopArrowRefs.current.forEach(prepareStroke);
        desktopHeadRefs.current.forEach(prepareStroke);
        desktopNoteRefs.current.forEach((n) => gsap.set(n, { opacity: 0, y: 10 }));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1.2,
            start: "top top",
            end: "+=360%",
            anticipatePin: 1,
          },
        });

        // SCENE 1 — Hero typography, nav, metadata & wall fade into dark charcoal
        tl.to(
          [headerRef.current, mobilePillRef.current],
          { opacity: 0, y: -14, duration: 0.7, ease: "power2.out" },
          0,
        )
          .to(
            titleRef.current,
            { opacity: 0, y: -22, duration: 0.85, ease: "power2.out" },
            0.05,
          )
          .to(
            footerRef.current,
            { opacity: 0, y: 16, duration: 0.75, ease: "power2.out" },
            0.05,
          )
          .set(
            [headerRef.current, footerRef.current],
            { pointerEvents: "none" },
            0.6,
          )
          // Crossfade from full hero background to isolated portrait layer at right-side position
          .to(
            portraitLayerRef.current,
            { opacity: 1, duration: 0.5, ease: "power1.inOut" },
            0.25,
          )
          .to(
            bgLayerRef.current,
            { opacity: 0, duration: 0.8, ease: "power1.inOut" },
            0.35,
          );

        // SCENE 2 — Portrait glides smoothly from right side to center
        tl.to(
          portraitLayerRef.current,
          {
            x: 0,
            y: "1vh",
            scale: 0.86,
            duration: 1.5,
            ease: "power2.inOut",
          },
          1.1,
        ).to(
          introLabelRef.current,
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          2.2,
        );

        // SCENE 3 — Hand-drawn SVG arrows & handwritten annotations sequentially
        let cursor = 2.5;
        ANNOTATIONS.forEach((_, i) => {
          tl.to(
            desktopArrowRefs.current[i],
            { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" },
            cursor,
          )
            .to(
              desktopHeadRefs.current[i],
              { strokeDashoffset: 0, duration: 0.25, ease: "power2.out" },
              cursor + 0.48,
            )
            .to(
              desktopNoteRefs.current[i],
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
              cursor + 0.35,
            );
          cursor += 0.95;
        });

        // Subtle hold before unpinning into BusinessSection
        tl.to({}, { duration: 0.8 });
      });

      // ─── Mobile (< 768px) ───────────────────────────────────────────
      mm.add("(max-width: 767px)", () => {
        gsap.set(portraitLayerRef.current, {
          opacity: 0,
          x: "10vw",
          y: "0vh",
          scale: 1.05,
        });
        gsap.set(introLabelRef.current, { opacity: 0, y: 6 });
        mobileNoteRefs.current.forEach((n) => gsap.set(n, { opacity: 0, y: 12 }));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1.1,
            start: "top top",
            end: "+=300%",
            anticipatePin: 1,
          },
        });

        // SCENE 1 — Fade out hero UI + background
        tl.to(
          [headerRef.current, mobilePillRef.current],
          { opacity: 0, y: -12, duration: 0.65, ease: "power2.out" },
          0,
        )
          .to(
            titleRef.current,
            { opacity: 0, y: -18, duration: 0.75, ease: "power2.out" },
            0.05,
          )
          .to(
            footerRef.current,
            { opacity: 0, y: 14, duration: 0.7, ease: "power2.out" },
            0.05,
          )
          .set(
            [headerRef.current, footerRef.current],
            { pointerEvents: "none" },
            0.55,
          )
          .to(
            portraitLayerRef.current,
            { opacity: 1, duration: 0.45, ease: "power1.inOut" },
            0.22,
          )
          .to(
            bgLayerRef.current,
            { opacity: 0, duration: 0.75, ease: "power1.inOut" },
            0.3,
          );

        // SCENE 2 — Portrait centers in upper half so annotations sit cleanly below
        tl.to(
          portraitLayerRef.current,
          {
            x: 0,
            y: "-17vh",
            scale: 0.64,
            duration: 1.3,
            ease: "power2.inOut",
          },
          0.95,
        ).to(
          introLabelRef.current,
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          1.95,
        );

        // SCENE 3 — Annotations reveal sequentially below portrait
        let cursor = 2.2;
        ANNOTATIONS.forEach((_, i) => {
          tl.to(
            mobileNoteRefs.current[i],
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            cursor,
          );
          cursor += 0.65;
        });

        tl.to({}, { duration: 0.6 });
      });
    })();

    return () => {
      cleanup?.();
    };
  }, []);

  const scrollToNext = () => {
    const el = document.getElementById("business");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="hero"
        className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden bg-[#0e0e0e] px-6 py-7 sm:px-10 sm:py-9 md:px-14 md:py-10"
      >
        {/* Full-bleed Hero Background Portrait + Scrims (Fades out in Scene 1) */}
        <div
          ref={bgLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <Image
            src="/hero-portrait.png"
            alt={identity.fullName}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_20%] sm:object-[78%_center] lg:object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/90 via-[#0e0e0e]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/85 via-transparent to-[#0e0e0e]/45" />
        </div>

        {/* Isolated Transparent Portrait Layer (Crossfades in & moves to center in Scene 2) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
        >
          <div
            ref={portraitLayerRef}
            className="relative h-[62dvh] w-[56dvh] max-h-[600px] max-w-[92vw] opacity-0 md:h-[68vh] md:w-[61vh]"
          >
            <Image
              src="/hero-portrait-cutout.png"
              alt=""
              fill
              sizes="(max-width: 767px) 85vw, 600px"
              className="object-contain grayscale contrast-[1.04]"
            />
          </div>
        </div>

        {/* Scene 3 — Hand-Drawn Doodles & Editorial Annotations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
        >
          {/* Subtle Scene Label */}
          <div
            ref={introLabelRef}
            className="absolute left-6 top-7 opacity-0 sm:left-10 sm:top-9 md:left-14 md:top-10"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream-muted">
              01 / Introduction
            </span>
          </div>

          {/* Desktop Hand-Drawn SVG Arrows + Annotations */}
          <div className="relative hidden h-full w-full md:block">
            <svg
              viewBox="0 0 1200 760"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 h-full w-full"
              fill="none"
            >
              {ANNOTATIONS.map((item, i) => (
                <g key={item.id}>
                  <path
                    ref={(el) => {
                      desktopArrowRefs.current[i] = el;
                    }}
                    d={item.linePath}
                    stroke="rgba(237, 233, 224, 0.52)"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0"
                  />
                  <path
                    ref={(el) => {
                      desktopHeadRefs.current[i] = el;
                    }}
                    d={item.headPath}
                    stroke="rgba(237, 233, 224, 0.6)"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0"
                  />
                </g>
              ))}
            </svg>

            {ANNOTATIONS.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => {
                  desktopNoteRefs.current[i] = el;
                }}
                className={`absolute opacity-0 ${item.desktopPos}`}
              >
                <p
                  className="text-2xl leading-none tracking-[0.04em] text-cream lg:text-[28px]"
                  style={{ fontFamily: "var(--font-hand)" }}
                >
                  {item.title}
                </p>
                <p className="mt-1.5 font-sans text-xs leading-relaxed text-cream-muted lg:text-[13px]">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Annotations (Positioned cleanly below centered portrait, no overlap) */}
          <div className="flex h-full w-full flex-col justify-end px-6 pb-8 md:hidden">
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-cream/10 pt-5">
              {ANNOTATIONS.map((item, i) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    mobileNoteRefs.current[i] = el;
                  }}
                  className="opacity-0"
                >
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="shrink-0 text-cream/55"
                    >
                      <path
                        d="M2 11 C 5 9, 7 6, 10 3 M7 3 L 10.5 2.5 L 10 6"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p
                      className="text-lg leading-none tracking-[0.03em] text-cream"
                      style={{ fontFamily: "var(--font-hand)" }}
                    >
                      {item.title}
                    </p>
                  </div>
                  <p className="mt-1 font-sans text-[11px] leading-snug text-cream-muted">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Bar */}
        <header
          ref={headerRef}
          className="relative z-30 flex items-center justify-between gap-4"
        >
          {/* Left: Name (always) + Subtitle (desktop only) */}
          <div className="flex items-center gap-6 sm:gap-10 md:gap-16">
            <a href="#hero" className="group block focus:outline-none">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-cream transition-opacity group-hover:opacity-80 sm:text-sm">
                {identity.fullName}
              </p>
              <p className="mt-0.5 hidden font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-cream-muted sm:block">
                {identity.topSubtitle}
              </p>
            </a>

            {/* Status Pill — desktop only */}
            <div className="hidden items-center gap-2.5 rounded-full border border-cream/20 bg-obsidian/50 px-4 py-1.5 backdrop-blur-sm sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-cream/70" />
              <span className="font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-cream/90">
                {identity.pillText}
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 sm:gap-5">
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
        <div
          ref={mobilePillRef}
          className="relative z-30 mt-3 flex items-center justify-between sm:hidden"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-obsidian/65 px-3.5 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cream/75" />
            <span className="font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-cream/90">
              {identity.pillText}
            </span>
          </div>
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

        {/* Centerpiece — Crisp Heavy Condensed Display Typography */}
        <div ref={titleRef} className="relative z-30 my-auto py-6 sm:py-10">
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
        <footer
          ref={footerRef}
          className="animate-rise-3 relative z-30 flex flex-col gap-4 pt-2 sm:gap-6 sm:pt-4 md:flex-row md:items-end md:justify-between"
        >
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

            <div className="col-span-2 sm:col-span-1 md:pl-8 lg:pl-12">
              <p className="font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-cream-muted">
                {identity.interestedInLabel}
              </p>
              <p className="mt-1 font-sans text-xs font-normal text-cream/95 sm:text-sm">
                {identity.interestedInValue}
              </p>
            </div>
          </div>

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
