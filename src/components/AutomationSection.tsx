"use client";

import { useEffect, useRef } from "react";

/* ─── Workflow node data ───────────────────────────────────────── */
const NODES = [
  { id: "trigger",  icon: "↓",  label: "Trigger"  },
  { id: "process",  icon: "⚙", label: "Process"  },
  { id: "ai",       icon: "◈",  label: "AI Agent" },
  { id: "generate", icon: "▶", label: "Generate" },
  { id: "send",     icon: "✓",  label: "Send"     },
] as const;

/* ─── Shared style tokens ──────────────────────────────────────── */
const mono: React.CSSProperties = { fontFamily: "monospace" };
const dim  = (a: number) => `rgba(255,255,255,${a})`;

export function AutomationSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const lidRef       = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const customerRef  = useRef<HTMLDivElement>(null);
  const workflowRef  = useRef<HTMLDivElement>(null);
  const nodeRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const aiRef        = useRef<HTMLDivElement>(null);
  const doneRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gsapCtx: { revert: () => void } | undefined;

    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger }  = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsapCtx = gsap.context(() => {
        /* ── Set initial hidden states (closed laptop) ─────────── */
        gsap.set(lidRef.current,       { rotateX: -90 });
        gsap.set(
          [glowRef.current, workspaceRef.current, workflowRef.current, doneRef.current],
          { opacity: 0 },
        );
        gsap.set([customerRef.current, aiRef.current], { opacity: 0, y: 14 });
        nodeRefs.current.forEach(n => gsap.set(n, { opacity: 0, scale: 0.72 }));
        lineRefs.current.forEach(l =>
          gsap.set(l, { scaleX: 0, transformOrigin: "left center" }),
        );

        /* ── Reduced-motion: skip to final state immediately ──── */
        if (reduced) {
          gsap.set(lidRef.current, { rotateX: -4 });
          gsap.set(
            [glowRef.current, workspaceRef.current, workflowRef.current, doneRef.current],
            { opacity: 1 },
          );
          gsap.set([customerRef.current, aiRef.current], { opacity: 1, y: 0 });
          nodeRefs.current.forEach(n => gsap.set(n, { opacity: 1, scale: 1 }));
          lineRefs.current.forEach(l => gsap.set(l, { scaleX: 1 }));
          return;
        }

        /* ── Scroll-pinned cinematic timeline ─────────────────── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger : sectionRef.current,
            pin     : true,
            scrub   : 1.5,
            start   : "top top",
            end     : "+=350%",
          },
        });

        // 1 · Lid opens smoothly upward (-90deg closed -> -4deg open)
        tl.to(lidRef.current, { rotateX: -4, duration: 2, ease: "power2.inOut" });

        // 2 · Screen lights up
        tl.to(glowRef.current,      { opacity: 1, duration: 0.6 }, "-=0.5");
        tl.to(workspaceRef.current, { opacity: 1, duration: 0.8 }, "-=0.4");

        // 3 · Customer message arrives
        tl.to(customerRef.current, { opacity: 1, y: 0, duration: 0.6 });

        // 4 · Workflow panel fades in
        tl.to(workflowRef.current, { opacity: 1, duration: 0.5 });

        // 5 · Nodes + connecting lines activate sequentially
        NODES.forEach((_, i) => {
          tl.to(nodeRefs.current[i], { opacity: 1, scale: 1, duration: 0.4 });
          if (i < NODES.length - 1) {
            tl.to(lineRefs.current[i], { scaleX: 1, duration: 0.3 }, "-=0.1");
          }
        });

        // 6 · AI response appears
        tl.to(aiRef.current, { opacity: 1, y: 0, duration: 0.6 });

        // 7 · Completion indicator
        tl.to(doneRef.current, { opacity: 1, scale: 1, duration: 0.5 });
      }, sectionRef);
    })();

    return () => { gsapCtx?.revert(); };
  }, []);

  /* ─── Laptop dimensions (responsive) ──────────────────────────── */
  const LW = "min(600px, 92vw)";
  const LH = "min(380px, 60vw)";

  return (
    <section
      ref={sectionRef}
      id="automation"
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 65%, rgba(255,255,255,0.022) 0%, transparent 100%)",
        }}
      />

      {/* Top-left label */}
      <p
        className="absolute left-6 top-8 sm:left-10 md:left-14"
        style={{ ...mono, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: dim(0.25) }}
      >
        AI Automation
      </p>

      {/* Top-right label */}
      <p
        className="absolute right-6 top-8 sm:right-10 md:right-14"
        style={{ ...mono, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: dim(0.25) }}
      >
        Workflow Demo
      </p>

      {/* ══════════════ 3-D Laptop Scene ══════════════ */}
      <div
        style={{ perspective: "1200px", perspectiveOrigin: "50% 28%" }}
      >
        <div style={{ transformStyle: "preserve-3d", transform: "rotateX(6deg) rotateY(-1.5deg)" }}>

          {/* ── LID ─────────────────────────────────────── */}
          <div
            ref={lidRef}
            style={{
              width: LW,
              height: LH,
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
              borderRadius: "10px 10px 2px 2px",
              position: "relative",
            }}
          >
            {/* Outer closed lid shell (visible when closed) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "10px 10px 2px 2px",
                background: "linear-gradient(145deg, #242424 0%, #151515 100%)",
                boxShadow: `0 0 0 1px ${dim(0.08)}, inset 0 1px 0 ${dim(0.08)}`,
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
              }}
            />

            {/* Front lid frame + inner screen bezel */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "10px 10px 2px 2px",
                background: "#1b1b1b",
                boxShadow: `0 0 0 1px ${dim(0.07)}, inset 0 0 0 1px rgba(0,0,0,0.6)`,
                backfaceVisibility: "hidden",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 10,
                  borderRadius: 6,
                  background: "#040404",
                  overflow: "hidden",
                }}
              >
              {/* Screen glow (off → on) */}
              <div
                ref={glowRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  background:
                    "radial-gradient(ellipse 85% 60% at 50% 35%, rgba(255,255,255,0.03) 0%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* ── Workspace UI ──────────────────────────── */}
              <div
                ref={workspaceRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Title bar */}
                <div
                  style={{
                    padding: "5px 10px",
                    borderBottom: `1px solid ${dim(0.055)}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(255,255,255,0.012)",
                    flexShrink: 0,
                  }}
                >
                  {[0.18, 0.1, 0.1].map((a, i) => (
                    <div
                      key={i}
                      style={{ width: 7, height: 7, borderRadius: "50%", background: dim(a) }}
                    />
                  ))}
                  <span
                    style={{ marginLeft: "auto", ...mono, fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: dim(0.28) }}
                  >
                    Automation Studio
                  </span>
                </div>

                {/* Main body: workflow + chat */}
                <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

                  {/* LEFT — Workflow panel */}
                  <div
                    ref={workflowRef}
                    style={{
                      width: "56%",
                      borderRight: `1px solid ${dim(0.055)}`,
                      padding: "10px 10px 8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      opacity: 0,
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ ...mono, fontSize: 7, letterSpacing: "0.18em", textTransform: "uppercase", color: dim(0.28) }}>
                      Workflow
                    </span>

                    {/* Nodes row */}
                    <div style={{ flex: 1, display: "flex", alignItems: "center", minWidth: 0 }}>
                      {NODES.flatMap((node, i) => {
                        const items: React.ReactNode[] = [
                          <div
                            key={`node-${i}`}
                            ref={el => { nodeRefs.current[i] = el; }}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 4,
                              opacity: 0,
                              transform: "scale(0.72)",
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 7,
                                border: `1px solid ${dim(0.18)}`,
                                background: "rgba(255,255,255,0.045)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                color: dim(0.65),
                              }}
                            >
                              {node.icon}
                            </div>
                            <span style={{ ...mono, fontSize: 6.5, color: dim(0.38), textAlign: "center", whiteSpace: "nowrap" }}>
                              {node.label}
                            </span>
                          </div>,
                        ];
                        if (i < NODES.length - 1) {
                          items.push(
                            <div
                              key={`line-${i}`}
                              ref={el => { lineRefs.current[i] = el; }}
                              style={{
                                flex: 1,
                                height: 1,
                                background: `linear-gradient(to right, ${dim(0.3)}, ${dim(0.12)})`,
                                transform: "scaleX(0)",
                                transformOrigin: "left center",
                                marginBottom: 15,
                                minWidth: 4,
                              }}
                            />,
                          );
                        }
                        return items;
                      })}
                    </div>

                    {/* Completion indicator */}
                    <div
                      ref={doneRef}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        opacity: 0,
                        transform: "scale(0.85)",
                      }}
                    >
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: dim(0.45) }} />
                      <span style={{ ...mono, fontSize: 7, letterSpacing: "0.1em", color: dim(0.35) }}>
                        Workflow completed
                      </span>
                    </div>
                  </div>

                  {/* RIGHT — Chat panel */}
                  <div style={{ flex: 1, background: "#090909", display: "flex", flexDirection: "column", minWidth: 0 }}>
                    {/* Chat header */}
                    <div
                      style={{
                        padding: "7px 10px",
                        borderBottom: `1px solid ${dim(0.055)}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: dim(0.08),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          ...mono,
                          fontSize: 9,
                          color: dim(0.5),
                          flexShrink: 0,
                        }}
                      >
                        W
                      </div>
                      <div>
                        <p style={{ ...mono, fontSize: 8, color: dim(0.65), margin: 0 }}>Customer Chat</p>
                        <p style={{ ...mono, fontSize: 6.5, color: dim(0.28), margin: 0 }}>Automated · Simulated</p>
                      </div>
                    </div>

                    {/* Messages area */}
                    <div
                      style={{
                        flex: 1,
                        padding: "10px 8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        overflow: "hidden",
                      }}
                    >
                      {/* Customer message */}
                      <div
                        ref={customerRef}
                        style={{ opacity: 0, transform: "translateY(14px)", display: "flex" }}
                      >
                        <div
                          style={{
                            maxWidth: "82%",
                            background: dim(0.075),
                            borderRadius: "8px 8px 8px 2px",
                            padding: "5px 8px",
                          }}
                        >
                          <p style={{ fontSize: 7.5, color: dim(0.72), margin: 0, lineHeight: 1.55 }}>
                            Hi! I&apos;m interested in your services. Can you tell me more?
                          </p>
                          <p style={{ ...mono, fontSize: 6, color: dim(0.28), margin: "2px 0 0", textAlign: "right" }}>12:34</p>
                        </div>
                      </div>

                      {/* AI response */}
                      <div
                        ref={aiRef}
                        style={{ opacity: 0, transform: "translateY(14px)", display: "flex", justifyContent: "flex-end" }}
                      >
                        <div
                          style={{
                            maxWidth: "88%",
                            background: dim(0.11),
                            borderRadius: "8px 8px 2px 8px",
                            padding: "5px 8px",
                          }}
                        >
                          <p style={{ fontSize: 7.5, color: dim(0.72), margin: 0, lineHeight: 1.55 }}>
                            Hi! Thanks for reaching out. I&apos;d be happy to help. What kind of solution are you looking for?
                          </p>
                          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 3, marginTop: 2 }}>
                            <p style={{ ...mono, fontSize: 6, color: dim(0.28), margin: 0 }}>12:34</p>
                            <span style={{ fontSize: 7, color: dim(0.4) }}>✓✓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              {/* ── End Workspace UI ───────────────────────── */}
            </div>
            {/* End screen bezel */}
            </div>
            {/* End front lid frame */}
          </div>
          {/* ── End LID ──────────────────────────────────────── */}

          {/* ── BASE ─────────────────────────────────────────── */}
          <div
            style={{
              width: LW,
              height: "max(13px, 2.3vw)",
              background: "linear-gradient(to bottom, #2b2b2b, #191919)",
              borderRadius: "0 0 10px 10px",
              boxShadow: `0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px ${dim(0.045)}`,
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: dim(0.05) }} />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "18%",
                height: "60%",
                background: "rgba(255,255,255,0.022)",
                borderRadius: "2px 2px 0 0",
                border: `1px solid ${dim(0.04)}`,
                borderBottom: "none",
              }}
            />
          </div>
          {/* ── End BASE ─────────────────────────────────────── */}

        </div>
      </div>
      {/* ══════════════ End Laptop Scene ══════════════ */}

      {/* Disclaimer */}
      <p
        className="absolute bottom-7 left-6 sm:left-10 md:left-14"
        style={{ ...mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: dim(0.17) }}
      >
        Simulated demonstration · Not a live integration
      </p>
    </section>
  );
}
