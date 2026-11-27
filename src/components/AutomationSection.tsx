"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   TYPES & DATA — 3 Industry Pipelines × 5 Nodes + Synced WhatsApp Chat
   ═══════════════════════════════════════════════════════════════════ */

interface WorkflowNode {
  step: number;
  shortLabel: string;
  title: string;
  icon: string;
  tag: string;
  description: string;
  payloadLabel: string;
  payload: string;
  impact: string;
}

interface ChatMessage {
  id: string;
  sender: "customer" | "ai" | "system";
  text: string;
  time: string;
  /** Minimum node index (0-4) at which this message appears */
  revealAtNode: number;
}

interface IndustryWorkflow {
  id: string;
  pillLabel: string;
  title: string;
  contactName: string;
  contactInitials: string;
  contactSubtitle: string;
  outcomePill: string;
  nodes: [WorkflowNode, WorkflowNode, WorkflowNode, WorkflowNode, WorkflowNode];
  messages: ChatMessage[];
}

const WORKFLOWS: IndustryWorkflow[] = [
  {
    id: "real-estate",
    pillLabel: "Real Estate",
    title: "Real Estate Lead & Viewing Engine",
    contactName: "Priya Sharma",
    contactInitials: "PS",
    contactSubtitle: "online · Zillow 2BR Inquiry",
    outcomePill: "Lead response: < 10 sec · Auto-booked viewings",
    nodes: [
      {
        step: 1,
        shortLabel: "Trigger",
        title: "Portal / Ad Webhook",
        icon: "↓",
        tag: "Zillow + Meta Ads",
        description:
          "Captures listing inquiry in real-time, deduplicates by phone, and extracts budget, area, and move-in timeline.",
        payloadLabel: "Incoming Lead JSON",
        payload: `{
  "name": "Priya Sharma",
  "budget": "$650k",
  "area": "Downtown",
  "beds": "2BR",
  "timeline": "30 days"
}`,
        impact: "< 3s capture",
      },
      {
        step: 2,
        shortLabel: "Process",
        title: "Enrich & Match",
        icon: "⚙",
        tag: "Inventory + CRM",
        description:
          "Checks live inventory sheet for matching 2BR units under $650k and verifies buyer mortgage pre-approval status.",
        payloadLabel: "Matched Inventory",
        payload: `{
  "matches": ["Unit 12B ($639k)", "Unit 5A ($645k)"],
  "pre_approved": true,
  "score": 92
}`,
        impact: "Instant match",
      },
      {
        step: 3,
        shortLabel: "AI Agent",
        title: "Qualify & Slot Finder",
        icon: "◈",
        tag: "OpenAI + Calendar",
        description:
          "Answers property FAQs (HOA, parking, sq ft), confirms urgency, and pulls 2 open viewing slots from the agent's calendar.",
        payloadLabel: "AI Reasoning Output",
        payload: `{
  "intent": "schedule_viewing",
  "slots_offered": ["Sat 2:00 PM", "Mon 11:00 AM"],
  "faqs_resolved": ["HOA $420/mo", "1 EV spot"]
}`,
        impact: "< 10s reply",
      },
      {
        step: 4,
        shortLabel: "Generate",
        title: "CRM + Calendar Sync",
        icon: "▶",
        tag: "HubSpot + GCal",
        description:
          "Creates the calendar invite for Unit 12B, moves the HubSpot deal stage to 'Viewing Scheduled', and assigns the listing agent.",
        payloadLabel: "Sync Payload",
        payload: `{
  "crm_stage": "Viewing Scheduled",
  "calendar_event": "evt_RE7204",
  "slot": "Sat 2:00 PM"
}`,
        impact: "Zero manual entry",
      },
      {
        step: 5,
        shortLabel: "Send",
        title: "Confirm & Remind",
        icon: "✓",
        tag: "WhatsApp API",
        description:
          "Sends the confirmed viewing pass with address pin on WhatsApp and queues 24h + 1h automated reminders.",
        payloadLabel: "Delivery Status",
        payload: `{
  "whatsapp_delivered": true,
  "reminders_queued": ["24h_before", "1h_before"]
}`,
        impact: "Auto-booked viewing",
      },
    ],
    messages: [
      {
        id: "re-1",
        sender: "customer",
        text: "Hi! Saw the 2BR Downtown listing. My budget is around $650k and I'm looking to move within 30 days. Is it still available?",
        time: "10:14",
        revealAtNode: 0,
      },
      {
        id: "re-sys-1",
        sender: "system",
        text: "CRM matched 2 units · Pre-approval verified",
        time: "10:14",
        revealAtNode: 1,
      },
      {
        id: "re-2",
        sender: "ai",
        text: "Hi Priya! Yes, Unit 12B at Elm Tower ($639k, 2BR + 1 EV parking) is available. Would you like to tour it Sat at 2:00 PM or Mon at 11:00 AM?",
        time: "10:14",
        revealAtNode: 2,
      },
      {
        id: "re-3",
        sender: "customer",
        text: "Saturday 2:00 PM works great!",
        time: "10:15",
        revealAtNode: 3,
      },
      {
        id: "re-4",
        sender: "ai",
        text: "Confirmed! Your viewing for Unit 12B is booked for Saturday at 2:00 PM. Calendar invite & gate code sent — see you then!",
        time: "10:15",
        revealAtNode: 4,
      },
    ],
  },
  {
    id: "plumbing",
    pillLabel: "Plumbing",
    title: "Plumbing Dispatch & Missed-Call Recovery",
    contactName: "Marcus Vance",
    contactInitials: "MV",
    contactSubtitle: "online · Missed Call Recovery",
    outcomePill: "Zero missed emergency jobs · 5s SMS recovery",
    nodes: [
      {
        step: 1,
        shortLabel: "Trigger",
        title: "Missed Call / Form",
        icon: "↓",
        tag: "Twilio Webhook",
        description:
          "Catches unanswered inbound call or urgent web request within 2 seconds and extracts issue + ZIP code.",
        payloadLabel: "Missed Call Event",
        payload: `{
  "type": "missed_call",
  "from": "+1-512-555-0147",
  "issue": "Burst pipe under kitchen sink",
  "zip": "78704"
}`,
        impact: "< 2s capture",
      },
      {
        step: 2,
        shortLabel: "Process",
        title: "Urgency & Zone Triage",
        icon: "⚙",
        tag: "n8n Triage",
        description:
          "Validates 78704 service coverage and classifies severity as EMERGENCY based on burst-pipe keywords.",
        payloadLabel: "Triage Result",
        payload: `{
  "in_service_area": true,
  "severity": "EMERGENCY",
  "on_call_tech": "Mike R.",
  "eta": "20-30 min"
}`,
        impact: "Auto severity check",
      },
      {
        step: 3,
        shortLabel: "AI Agent",
        title: "Instant Responder",
        icon: "◈",
        tag: "GPT-4 + WhatsApp/SMS",
        description:
          "Messages the homeowner within 5 seconds confirming emergency availability and requests a quick photo & street address.",
        payloadLabel: "Outbound Prompt",
        payload: `{
  "latency": "4.2s",
  "action": "request_photo_and_address",
  "slot_held": "priority_emergency"
}`,
        impact: "5s recovery",
      },
      {
        step: 4,
        shortLabel: "Dispatch",
        title: "Tech Alert & Ticket",
        icon: "▶",
        tag: "Slack + Dispatch",
        description:
          "Logs ticket #PL-3391 on the dispatch board and pings on-call plumber Mike R. with the photo, shut-off notes, and GPS pin.",
        payloadLabel: "Dispatch Brief",
        payload: `{
  "ticket": "PL-3391",
  "tech": "Mike R.",
  "gps_pin": "2104 S Lamar Blvd",
  "board_status": "Dispatched"
}`,
        impact: "Instant tech brief",
      },
      {
        step: 5,
        shortLabel: "Send",
        title: "Live ETA Update",
        icon: "✓",
        tag: "WhatsApp / SMS",
        description:
          "Sends the homeowner live technician tracking link and shut-off valve safety tip while Mike is en route.",
        payloadLabel: "Homeowner Alert",
        payload: `{
  "eta_link": "track.plumb.co/PL-3391",
  "eta_minutes": 22,
  "delivered": true
}`,
        impact: "Zero lost emergencies",
      },
    ],
    messages: [
      {
        id: "pl-sys-1",
        sender: "system",
        text: "Missed call detected from +1-512-555-0147 · ZIP 78704",
        time: "07:03",
        revealAtNode: 0,
      },
      {
        id: "pl-1",
        sender: "ai",
        text: "Sorry we missed your call! Saw your urgent note about the burst pipe in 78704. We have an emergency plumber available now — can you share your address & a quick photo?",
        time: "07:03",
        revealAtNode: 2,
      },
      {
        id: "pl-2",
        sender: "customer",
        text: "2104 S Lamar Blvd. Water is spraying under the kitchen sink — shut off the main valve just now.",
        time: "07:04",
        revealAtNode: 3,
      },
      {
        id: "pl-sys-2",
        sender: "system",
        text: "Ticket #PL-3391 dispatched to Mike R.",
        time: "07:04",
        revealAtNode: 3,
      },
      {
        id: "pl-3",
        sender: "ai",
        text: "Got it, Marcus! Mike R. is dispatched and 22 mins away. Live ETA: track.plumb.co/PL-3391",
        time: "07:04",
        revealAtNode: 4,
      },
    ],
  },
  {
    id: "glass-cleaning",
    pillLabel: "Glass Cleaning",
    title: "Glass Cleaning Quote & Follow-Up",
    contactName: "David Chen",
    contactInitials: "DC",
    contactSubtitle: "online · Quote Request",
    outcomePill: "Instant quote-to-booking · Automated follow-ups",
    nodes: [
      {
        step: 1,
        shortLabel: "Trigger",
        title: "Quote Request Form",
        icon: "↓",
        tag: "Web Form + n8n",
        description:
          "Captures residential/commercial inquiry with window count, story height, skylight count, and desired frequency.",
        payloadLabel: "Quote Request",
        payload: `{
  "name": "David Chen",
  "scope": "2-story home, 24 windows + skylight",
  "frequency": "Quarterly"
}`,
        impact: "< 3s intake",
      },
      {
        step: 2,
        shortLabel: "Process",
        title: "Pricing Matrix Lookup",
        icon: "⚙",
        tag: "Pricing Sheet",
        description:
          "Calculates base estimate using window count, 2-story ladder factor, skylight surcharge, and 10% quarterly discount.",
        payloadLabel: "Calculated Quote",
        payload: `{
  "base_24_windows": "$285.00",
  "skylight": "$40.00",
  "quarterly_discount": "-10%",
  "total": "$292.50"
}`,
        impact: "Accurate in 100ms",
      },
      {
        step: 3,
        shortLabel: "AI Agent",
        title: "Estimate & Upsell",
        icon: "◈",
        tag: "GPT-4 + WhatsApp",
        description:
          "Sends an itemized quote breakdown on WhatsApp and recommends deep screen & track cleaning (+$40) with instant Q&A.",
        payloadLabel: "Upsell & Reply",
        payload: `{
  "estimate_total": "$292.50",
  "suggested_addon": "Screen & Track (+$40)",
  "upsell_accepted": true
}`,
        impact: "+14% avg ticket",
      },
      {
        step: 4,
        shortLabel: "Generate",
        title: "Booking Link & Plan",
        icon: "▶",
        tag: "Cal.com + Stripe",
        description:
          "Generates a one-click approval & booking link for the $332.50 package and arms a 48-hour follow-up if unopened.",
        payloadLabel: "Booking Payload",
        payload: `{
  "revised_total": "$332.50",
  "booking_url": "book.clearglass.co/GC-5518",
  "followup_48h": "armed"
}`,
        impact: "Zero quote drop-off",
      },
      {
        step: 5,
        shortLabel: "Send",
        title: "Confirm & Recur",
        icon: "✓",
        tag: "n8n Sequences",
        description:
          "Confirms the cleaning slot, sends prep checklist, and schedules automatic quarterly renewal reminders.",
        payloadLabel: "Schedule Confirmed",
        payload: `{
  "booked_date": "Dec 14, 9:00 AM",
  "recurring_cycle": "Quarterly",
  "next_reminder": "90 days"
}`,
        impact: "Automated retention",
      },
    ],
    messages: [
      {
        id: "gc-1",
        sender: "customer",
        text: "Hey! Looking for a quote on a 2-story home — 24 windows plus 1 skylight. Ideally quarterly service.",
        time: "14:20",
        revealAtNode: 0,
      },
      {
        id: "gc-sys-1",
        sender: "system",
        text: "Pricing matrix calculated · 10% quarterly discount applied",
        time: "14:20",
        revealAtNode: 1,
      },
      {
        id: "gc-2",
        sender: "ai",
        text: "Hi David! Here's your estimate:\n• 24 windows (2-story) + 1 skylight: $325\n• Quarterly 10% off: $292.50\nWant to add deep screen & track cleaning for +$40?",
        time: "14:20",
        revealAtNode: 2,
      },
      {
        id: "gc-3",
        sender: "customer",
        text: "Yes, let's include the screen & track cleaning!",
        time: "14:22",
        revealAtNode: 3,
      },
      {
        id: "gc-4",
        sender: "ai",
        text: "Updated total is $332.50! Tap to pick your slot & confirm: book.clearglass.co/GC-5518 (we'll also remind you each quarter).",
        time: "14:22",
        revealAtNode: 4,
      },
    ],
  },
];

/* ─── Style helpers ──────────────────────────────────────────────── */
const mono: React.CSSProperties = { fontFamily: "var(--font-mono, monospace)" };
const dim = (a: number) => `rgba(255,255,255,${a})`;

const STEP_SCROLL_TARGETS = [0.24, 0.42, 0.58, 0.74, 0.92] as const;

function progressToStep(p: number): number {
  if (p < 0.34) return 0;
  if (p < 0.5) return 1;
  if (p < 0.66) return 2;
  if (p < 0.82) return 3;
  return 4;
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export function AutomationSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeNode, setActiveNode] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const screenGlowRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<{ start: number; end: number } | null>(null);
  const lastStepRef = useRef(0);

  const workflow = WORKFLOWS[activeTab];
  const currentNode = workflow.nodes[activeNode];

  /* ── Click node -> jump scroll & active step to that node ─────── */
  const goToStep = useCallback((idx: number) => {
    lastStepRef.current = idx;
    setActiveNode(idx);

    const st = stRef.current;
    if (st && st.end > st.start) {
      const targetY = st.start + (st.end - st.start) * STEP_SCROLL_TARGETS[idx];
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }, []);

  /* ── Switch workflow tab (steps still follow scroll / click) ───── */
  const handleTabSwitch = useCallback((idx: number) => {
    setActiveTab(idx);
  }, []);

  /* ── GSAP scroll-driven MacBook reveal + 5-step progression ────── */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mm: { revert: () => void } | undefined;

    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const matchMedia = gsap.matchMedia();
      mm = matchMedia;

      if (reduced) {
        gsap.set(lidRef.current, { rotateX: -2, opacity: 1 });
        gsap.set(baseRef.current, { opacity: 1, y: 0 });
        gsap.set([screenGlowRef.current, workspaceRef.current], { opacity: 1 });
        return;
      }

      /* Desktop: pin section and advance steps 01 -> 05 strictly on scroll */
      matchMedia.add("(min-width: 900px)", () => {
        gsap.set(lidRef.current, { rotateX: -65, opacity: 0.35 });
        gsap.set(baseRef.current, { opacity: 0, y: 24 });
        gsap.set([screenGlowRef.current, workspaceRef.current], { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 0.5,
            start: "top top",
            end: "+=280%",
            onRefresh: (self) => {
              stRef.current = { start: self.start, end: self.end };
            },
            onUpdate: (self) => {
              stRef.current = { start: self.start, end: self.end };
              const nextStep = progressToStep(self.progress);
              if (nextStep !== lastStepRef.current) {
                lastStepRef.current = nextStep;
                setActiveNode(nextStep);
              }
            },
          },
        });

        /* 0 -> 0.18: MacBook base rises & lid opens */
        tl.to(baseRef.current, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0)
          .to(lidRef.current, { rotateX: -2, opacity: 1, duration: 0.16, ease: "power2.out" }, 0)
          .to(screenGlowRef.current, { opacity: 1, duration: 0.08 }, 0.09)
          .to(workspaceRef.current, { opacity: 1, duration: 0.08 }, 0.1)
          /* Hold timeline to 1.0 so scrub spans the 5 workflow steps */
          .to({}, { duration: 0.82 }, 0.18);

        if (tl.scrollTrigger) {
          stRef.current = {
            start: tl.scrollTrigger.start,
            end: tl.scrollTrigger.end,
          };
        }
      });

      /* Mobile / tablet: no pin (tall stacked layout), advance steps on scroll */
      matchMedia.add("(max-width: 899px)", () => {
        gsap.set(lidRef.current, { rotateX: -2, opacity: 1 });
        gsap.set(baseRef.current, { opacity: 1, y: 0 });
        gsap.set([screenGlowRef.current, workspaceRef.current], { opacity: 1 });

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 40%",
          end: "bottom 65%",
          onRefresh: (self) => {
            stRef.current = { start: self.start, end: self.end };
          },
          onUpdate: (self) => {
            stRef.current = { start: self.start, end: self.end };
            const nextStep = progressToStep(self.progress);
            if (nextStep !== lastStepRef.current) {
              lastStepRef.current = nextStep;
              setActiveNode(nextStep);
            }
          },
        });

        stRef.current = { start: st.start, end: st.end };
      });
    })();

    return () => {
      mm?.revert();
    };
  }, []);

  /* Visible WhatsApp messages up to activeNode */
  const visibleMessages = workflow.messages.filter(
    (m) => m.revealAtNode <= activeNode,
  );

  return (
    <section
      ref={sectionRef}
      id="automation"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#080808",
        padding: "clamp(28px, 4vw, 56px) clamp(12px, 3vw, 48px)",
      }}
    >
      {/* Subtle radial ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 55%, rgba(255,255,255,0.025) 0%, transparent 100%)",
        }}
      />

      {/* ── Editorial Top Header ──────────────────────────────────── */}
      <div
        className="relative z-10 mb-6 flex w-full items-end justify-between sm:mb-8"
        style={{ maxWidth: 1140 }}
      >
        <div>
          <p
            style={{
              ...mono,
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: dim(0.32),
              margin: "0 0 6px",
            }}
          >
            02 / Automation
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(24px, 3.8vw, 42px)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              color: dim(0.92),
              margin: 0,
            }}
          >
            Automation Studio
          </h2>
        </div>

        <p
          className="hidden sm:block"
          style={{
            ...mono,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: dim(0.26),
            margin: 0,
          }}
        >
          Interactive MacBook Workspace
        </p>
      </div>

      {/* ══════════════ 3-D MacBook Scene ══════════════ */}
      <div
        className="relative z-10 w-full"
        style={{
          maxWidth: 1140,
          perspective: "1600px",
          perspectiveOrigin: "50% 35%",
        }}
      >
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* ── MACBOOK LID / DISPLAY ───────────────────────────────── */}
          <div
            ref={lidRef}
            style={{
              width: "100%",
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
              borderRadius: "14px 14px 4px 4px",
              background: "#181818",
              padding: "clamp(7px, 1vw, 12px)",
              paddingBottom: "clamp(10px, 1.3vw, 16px)",
              boxShadow: `0 0 0 1px ${dim(0.1)}, inset 0 1px 0 ${dim(0.09)}, 0 24px 60px rgba(0,0,0,0.65)`,
              position: "relative",
            }}
          >
            {/* Camera notch dot */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "clamp(3px, 0.45vw, 5px)",
                left: "50%",
                transform: "translateX(-50%)",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#0b0b0b",
                boxShadow: `0 0 0 1px ${dim(0.08)}`,
              }}
            />

            {/* Inner dark glass screen */}
            <div
              style={{
                position: "relative",
                borderRadius: 8,
                background: "#070707",
                border: `1px solid ${dim(0.06)}`,
                overflow: "hidden",
              }}
            >
              {/* Screen backlight glow */}
              <div
                ref={screenGlowRef}
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 80% 55% at 50% 25%, rgba(255,255,255,0.03) 0%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* ── MacBook Workspace UI ──────────────────────────── */}
              <div
                ref={workspaceRef}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* ── Top macOS Window Bar ───────────────────────── */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "9px 14px",
                    borderBottom: `1px solid ${dim(0.07)}`,
                    background: "rgba(255,255,255,0.018)",
                  }}
                >
                  {/* Traffic lights + Studio title */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.18)",
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.11)",
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.11)",
                          display: "inline-block",
                        }}
                      />
                    </div>
                    <span
                      className="hidden md:inline"
                      style={{
                        ...mono,
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: dim(0.36),
                      }}
                    >
                      Automation Studio
                    </span>
                  </div>

                  {/* Industry Switcher Pills */}
                  <div
                    className="hide-scrollbar"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      overflowX: "auto",
                      maxWidth: "100%",
                    }}
                  >
                    {WORKFLOWS.map((w, idx) => {
                      const active = idx === activeTab;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => handleTabSwitch(idx)}
                          style={{
                            ...mono,
                            fontSize: 10,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            padding: "5px 12px",
                            borderRadius: 999,
                            border: `1px solid ${active ? dim(0.28) : dim(0.06)}`,
                            background: active ? dim(0.08) : "transparent",
                            color: active ? dim(0.92) : dim(0.42),
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "all 0.2s ease",
                          }}
                        >
                          0{idx + 1} · {w.pillLabel}
                        </button>
                      );
                    })}
                  </div>

                  {/* Step Progress + Reset Trigger */}
                  <button
                    type="button"
                    onClick={() => goToStep(activeNode < 4 ? activeNode + 1 : 0)}
                    style={{
                      ...mono,
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "5px 13px",
                      borderRadius: 6,
                      border: `1px solid ${
                        activeNode === 4
                          ? "rgba(74,222,128,0.32)"
                          : dim(0.2)
                      }`,
                      background: dim(0.03),
                      color: activeNode === 4 ? "#4ade80" : dim(0.82),
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: activeNode === 4 ? "#4ade80" : dim(0.5),
                        display: "inline-block",
                      }}
                    />
                    {activeNode === 4
                      ? "↺ Step 01"
                      : `Step 0${activeNode + 1} / 05 · Next →`}
                  </button>
                </div>

                {/* ── Split Desktop Panes: Left (WORKFLOW) + Right (WhatsApp) ── */}
                <div className="mac-split-body">
                  {/* ══ LEFT PANE: WORKFLOW + INSPECTOR ═════════════ */}
                  <div
                    className="mac-left-pane"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.065) 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                      backgroundColor: "#090909",
                      padding: "clamp(14px, 2vw, 22px)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    {/* Pane top metadata */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          ...mono,
                          fontSize: 10,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: dim(0.38),
                        }}
                      >
                        WORKFLOW · {workflow.title}
                      </span>
                      <span
                        style={{
                          ...mono,
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: dim(0.28),
                        }}
                      >
                        Click any node
                      </span>
                    </div>

                    {/* Horizontal 5-Node Pipeline */}
                    <div className="wf-nodes-row">
                      {workflow.nodes.map((n, i) => {
                        const isActive = i === activeNode;
                        const isPassed = i <= activeNode;

                        return (
                          <div key={`${workflow.id}-node-${n.step}`} className="wf-node-item">
                            <button
                              type="button"
                              onClick={() => goToStep(i)}
                              className="wf-node-btn"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 6,
                                padding: "10px 6px",
                                borderRadius: 10,
                                border: `1px solid ${
                                  isActive
                                    ? "rgba(74,222,128,0.6)"
                                    : isPassed
                                      ? dim(0.18)
                                      : dim(0.07)
                                }`,
                                background: isActive
                                  ? "rgba(74,222,128,0.06)"
                                  : isPassed
                                    ? "rgba(255,255,255,0.03)"
                                    : "#0d0d0d",
                                boxShadow: isActive
                                  ? "0 0 18px rgba(74,222,128,0.14)"
                                  : "none",
                                cursor: "pointer",
                                transition: "transform 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                                transform: isActive ? "translateY(-2px)" : "translateY(0)",
                                width: "100%",
                              }}
                            >
                              <span
                                style={{
                                  ...mono,
                                  fontSize: 8,
                                  letterSpacing: "0.14em",
                                  color: isActive
                                    ? "#4ade80"
                                    : isPassed
                                      ? dim(0.55)
                                      : dim(0.28),
                                }}
                              >
                                0{n.step}
                              </span>
                              <span
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: 7,
                                  border: `1px solid ${
                                    isActive ? "rgba(74,222,128,0.5)" : dim(0.14)
                                  }`,
                                  background: "rgba(255,255,255,0.03)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 13,
                                  color: isActive ? "#4ade80" : dim(isPassed ? 0.8 : 0.45),
                                }}
                              >
                                {n.icon}
                              </span>
                              <span
                                style={{
                                  ...mono,
                                  fontSize: 9.5,
                                  color: isActive ? dim(0.95) : isPassed ? dim(0.7) : dim(0.45),
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {n.shortLabel}
                              </span>
                            </button>

                            {/* Connector line */}
                            {i < 4 && (
                              <div className="wf-connector" aria-hidden>
                                <div
                                  style={{
                                    width: "100%",
                                    height: 1,
                                    background:
                                      activeNode > i
                                        ? "rgba(74,222,128,0.45)"
                                        : dim(0.1),
                                    transition: "background 0.25s ease",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Compact Step Inspector inside Left Pane */}
                    <div
                      style={{
                        border: `1px solid ${dim(0.08)}`,
                        borderRadius: 9,
                        background: "rgba(12,12,12,0.92)",
                        padding: "12px 14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              ...mono,
                              fontSize: 9.5,
                              color: "#4ade80",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                            }}
                          >
                            0{currentNode.step} · {currentNode.title}
                          </span>
                        </div>
                        <span
                          style={{
                            ...mono,
                            fontSize: 9,
                            color: dim(0.42),
                            padding: "2px 7px",
                            borderRadius: 4,
                            border: `1px solid ${dim(0.08)}`,
                            background: dim(0.02),
                          }}
                        >
                          {currentNode.tag}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: 12.5,
                          lineHeight: 1.55,
                          color: dim(0.68),
                          margin: 0,
                        }}
                      >
                        {currentNode.description}
                      </p>

                      <div>
                        <p
                          style={{
                            ...mono,
                            fontSize: 8.5,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: dim(0.3),
                            margin: "0 0 5px",
                          }}
                        >
                          {currentNode.payloadLabel}
                        </p>
                        <pre
                          className="hide-scrollbar"
                          style={{
                            ...mono,
                            fontSize: 10.5,
                            lineHeight: 1.48,
                            color: dim(0.62),
                            background: "rgba(255,255,255,0.025)",
                            border: `1px solid ${dim(0.055)}`,
                            borderRadius: 6,
                            padding: "8px 10px",
                            margin: 0,
                            overflowX: "auto",
                            whiteSpace: "pre",
                          }}
                        >
                          {currentNode.payload}
                        </pre>
                      </div>

                      {/* Outcome footer pill */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 8,
                          paddingTop: 4,
                          borderTop: `1px solid ${dim(0.05)}`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#4ade80",
                              display: "inline-block",
                            }}
                          />
                          <span
                            style={{
                              ...mono,
                              fontSize: 9.5,
                              color: dim(0.58),
                            }}
                          >
                            {workflow.outcomePill}
                          </span>
                        </div>
                        <span
                          style={{
                            ...mono,
                            fontSize: 9,
                            color: dim(0.32),
                          }}
                        >
                          {currentNode.impact}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ══ RIGHT PANE: DARK-MODE WHATSAPP DESKTOP ═══════ */}
                  <div
                    className="mac-right-pane"
                    style={{
                      background: "#0b0d0c",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 390,
                    }}
                  >
                    {/* WhatsApp Header */}
                    <div
                      style={{
                        padding: "10px 14px",
                        borderBottom: `1px solid ${dim(0.07)}`,
                        background: "#111312",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "rgba(74,222,128,0.12)",
                            border: "1px solid rgba(74,222,128,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...mono,
                            fontSize: 11,
                            color: "#4ade80",
                            flexShrink: 0,
                          }}
                        >
                          {workflow.contactInitials}
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: 12.5,
                              fontWeight: 500,
                              color: dim(0.88),
                              margin: 0,
                              lineHeight: 1.25,
                            }}
                          >
                            {workflow.contactName}
                          </p>
                          <p
                            style={{
                              ...mono,
                              fontSize: 9.5,
                              color: "#4ade80",
                              margin: "2px 0 0",
                              opacity: 0.8,
                            }}
                          >
                            {workflow.contactSubtitle}
                          </p>
                        </div>
                      </div>

                      <span
                        style={{
                          ...mono,
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: dim(0.32),
                          border: `1px solid ${dim(0.08)}`,
                          borderRadius: 4,
                          padding: "2px 6px",
                        }}
                      >
                        WhatsApp
                      </span>
                    </div>

                    {/* WhatsApp Message Thread */}
                    <div
                      className="hide-scrollbar"
                      style={{
                        flex: 1,
                        padding: "14px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        overflowY: "auto",
                        backgroundImage:
                          "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
                        backgroundSize: "14px 14px",
                      }}
                    >
                      {visibleMessages.map((msg) => {
                        if (msg.sender === "system") {
                          return (
                            <div
                              key={msg.id}
                              style={{
                                alignSelf: "center",
                                padding: "3px 9px",
                                borderRadius: 6,
                                background: "rgba(255,255,255,0.04)",
                                border: `1px solid ${dim(0.06)}`,
                                ...mono,
                                fontSize: 9,
                                color: dim(0.45),
                                textAlign: "center",
                              }}
                            >
                              {msg.text}
                            </div>
                          );
                        }

                        const isAI = msg.sender === "ai";
                        return (
                          <div
                            key={msg.id}
                            style={{
                              display: "flex",
                              justifyContent: isAI ? "flex-end" : "flex-start",
                              animation: "msg-fade-in 0.25s ease forwards",
                            }}
                          >
                            <div
                              style={{
                                maxWidth: "86%",
                                padding: "8px 11px",
                                borderRadius: isAI
                                  ? "10px 10px 2px 10px"
                                  : "10px 10px 10px 2px",
                                background: isAI ? "#12261b" : "#181a19",
                                border: `1px solid ${
                                  isAI
                                    ? "rgba(74,222,128,0.18)"
                                    : dim(0.07)
                                }`,
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 12,
                                  lineHeight: 1.48,
                                  color: dim(0.86),
                                  margin: 0,
                                  whiteSpace: "pre-line",
                                }}
                              >
                                {msg.text}
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                  gap: 4,
                                  marginTop: 4,
                                }}
                              >
                                <span
                                  style={{
                                    ...mono,
                                    fontSize: 8.5,
                                    color: dim(0.34),
                                  }}
                                >
                                  {msg.time}
                                </span>
                                {isAI && (
                                  <span
                                    style={{
                                      fontSize: 9.5,
                                      color: "#4ade80",
                                      opacity: 0.85,
                                    }}
                                  >
                                    ✓✓
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {activeNode < 4 && (
                        <div
                          style={{
                            alignSelf: "center",
                            ...mono,
                            fontSize: 9,
                            color: dim(0.35),
                            padding: "4px 8px",
                          }}
                        >
                          Scroll or click next node to continue…
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Bottom Input Bar */}
                    <div
                      style={{
                        padding: "9px 12px",
                        borderTop: `1px solid ${dim(0.07)}`,
                        background: "#101211",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          padding: "6px 11px",
                          borderRadius: 999,
                          background: "#171918",
                          border: `1px solid ${dim(0.06)}`,
                          ...mono,
                          fontSize: 10.5,
                          color: dim(0.3),
                        }}
                      >
                        Automated reply active · WhatsApp Business API
                      </div>
                      <div
                        aria-hidden
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "rgba(74,222,128,0.14)",
                          border: "1px solid rgba(74,222,128,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          color: "#4ade80",
                          flexShrink: 0,
                        }}
                      >
                        ➤
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ── End Workspace UI ──────────────────────────────── */}
            </div>
            {/* ── End Inner Screen ────────────────────────────────── */}
          </div>
          {/* ── End MACBOOK LID ───────────────────────────────────── */}

          {/* ── MACBOOK CHASSIS BASE + HINGE + NOTCH ──────────────── */}
          <div
            ref={baseRef}
            style={{
              width: "102%",
              marginLeft: "-1%",
              height: "clamp(14px, 2vw, 22px)",
              background: "linear-gradient(to bottom, #2c2c2c 0%, #171717 100%)",
              borderRadius: "2px 2px 12px 12px",
              boxShadow: `0 18px 50px rgba(0,0,0,0.8), 0 0 0 1px ${dim(0.07)}`,
              position: "relative",
            }}
          >
            {/* Top hinge highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "6%",
                right: "6%",
                height: 1,
                background: dim(0.1),
              }}
            />
            {/* Thumb notch / trackpad lip */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "15%",
                height: "48%",
                background: "#141414",
                borderRadius: "0 0 6px 6px",
                border: `1px solid ${dim(0.07)}`,
                borderTop: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom Caption ────────────────────────────────────────── */}
      <div
        className="relative z-10 mt-6 flex w-full items-center justify-between sm:mt-8"
        style={{ maxWidth: 1140 }}
      >
        <p
          style={{
            ...mono,
            fontSize: 9.5,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: dim(0.24),
            margin: 0,
          }}
        >
          Simulated Infrastructure · Not a live integration
        </p>
        <p
          className="hidden sm:block"
          style={{
            ...mono,
            fontSize: 9.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: dim(0.2),
            margin: 0,
          }}
        >
          5-Step Live Pipeline
        </p>
      </div>

      {/* ── Scoped Responsive Layout & Keyframes ──────────────────── */}
      <style jsx global>{`
        @keyframes msg-fade-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes wf-pulse-move {
          0% {
            left: 0;
            opacity: 1;
          }
          100% {
            left: calc(100% - 6px);
            opacity: 0;
          }
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .mac-split-body {
          display: grid;
          grid-template-columns: 1.32fr 0.9fr;
        }
        .mac-left-pane {
          border-right: 1px solid rgba(255, 255, 255, 0.07);
        }

        .wf-nodes-row {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .wf-node-item {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }
        .wf-node-item:last-child {
          flex: 0 1 auto;
          min-width: 76px;
        }
        .wf-connector {
          position: relative;
          flex: 1;
          min-width: 10px;
          height: 10px;
          display: flex;
          align-items: center;
        }
        .wf-pulse-dot {
          position: absolute;
          top: 2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74, 222, 128, 0.65);
          animation: wf-pulse-move 0.48s ease forwards;
        }

        @media (max-width: 900px) {
          .mac-split-body {
            grid-template-columns: 1fr;
          }
          .mac-left-pane {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          }
        }

        @media (max-width: 640px) {
          .wf-nodes-row {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }
          .wf-node-item,
          .wf-node-item:last-child {
            flex: unset;
            min-width: 0;
          }
          .wf-node-item:last-child {
            grid-column: span 2;
          }
          .wf-connector {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
