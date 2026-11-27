"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   WORKFLOW DATA — 3 real-world automation pipelines, 4 nodes each
   ═══════════════════════════════════════════════════════════════════ */

interface NodeData {
  step: number;
  icon: string;
  title: string;
  tag: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
  impact: string;
}

interface WorkflowData {
  id: string;
  label: string;
  nodes: [NodeData, NodeData, NodeData, NodeData];
}

const WORKFLOWS: WorkflowData[] = [
  {
    id: "real-estate-lead",
    label: "01 / Real Estate Lead & Viewing Engine",
    nodes: [
      {
        step: 1,
        icon: "⚡",
        title: "Portal / Ad Webhook",
        tag: "Zillow + Meta Ads",
        description:
          "Captures every listing inquiry from portal contact forms and paid ad leads in real-time. Deduplicates by phone/email and enriches with UTM source data.",
        sampleInput: `{
  "source": "zillow_inquiry",
  "name": "Priya Sharma",
  "phone": "+1-512-555-0188",
  "budget": "$650k",
  "area": "Downtown",
  "beds": "2BR",
  "timeline": "30 days"
}`,
        sampleOutput: `{
  "lead_id": "RE-7204",
  "status": "new",
  "dedupe": "pass",
  "source_quality": "high_intent"
}`,
        impact: "< 3 sec lead capture",
      },
      {
        step: 2,
        icon: "⚙",
        title: "Enrich & Match",
        tag: "Google Sheets + CRM",
        description:
          "Cross-references the buyer's criteria against the live inventory sheet and CRM. Surfaces matching 2BR units under budget and verifies mortgage pre-approval status.",
        sampleInput: `{
  "lead_id": "RE-7204",
  "budget": "$650k",
  "area": "Downtown",
  "beds": "2BR"
}`,
        sampleOutput: `{
  "matches": 3,
  "top_listing": "Unit 12B, Elm Tower",
  "price": "$639,000",
  "pre_approved": true,
  "agent": "Sanskar K."
}`,
        impact: "Instant inventory matching",
      },
      {
        step: 3,
        icon: "◈",
        title: "Qualify & Schedule",
        tag: "OpenAI GPT-4 + WhatsApp",
        description:
          "AI agent replies on WhatsApp/SMS, answers property FAQs (HOA, sq ft, parking), qualifies buyer urgency, and proposes 2 open viewing slots from the agent's calendar.",
        sampleInput: `{
  "lead_id": "RE-7204",
  "matches": ["Unit 12B","Unit 5A","Unit 8C"],
  "pre_approved": true,
  "timeline": "30 days"
}`,
        sampleOutput: `{
  "qualified": true,
  "urgency": "high",
  "slots_offered": ["Sat 2 PM","Mon 11 AM"],
  "slot_chosen": "Sat 2 PM",
  "faqs_answered": 3
}`,
        impact: "Lead response: < 10 sec",
      },
      {
        step: 4,
        icon: "✓",
        title: "CRM + Calendar Sync",
        tag: "HubSpot + Google Calendar",
        description:
          "Books the viewing on the agent's calendar, moves the CRM deal stage to 'Viewing Scheduled', assigns the listing agent, and queues automated reminder messages.",
        sampleInput: `{
  "lead_id": "RE-7204",
  "slot_chosen": "Sat 2 PM",
  "listing": "Unit 12B, Elm Tower",
  "agent": "Sanskar K."
}`,
        sampleOutput: `{
  "calendar_event": "evt_RE7204",
  "crm_stage": "Viewing Scheduled",
  "reminder_queued": "24h + 1h before",
  "assigned_to": "sanskar@realty.co"
}`,
        impact: "Auto-booked viewings",
      },
    ],
  },
  {
    id: "plumbing-dispatch",
    label: "02 / Plumbing Dispatch & Missed-Call Recovery",
    nodes: [
      {
        step: 1,
        icon: "⚡",
        title: "Missed Call / Form",
        tag: "Twilio + n8n Webhook",
        description:
          "Captures every unanswered inbound call or urgent web request within seconds. Logs caller ID, voicemail transcript (if any), and form details like issue description and ZIP code.",
        sampleInput: `{
  "type": "missed_call",
  "from": "+1-512-555-0147",
  "voicemail": "Burst pipe under kitchen sink!",
  "issue": "Burst pipe under kitchen sink",
  "zip": "78704",
  "timestamp": "2024-11-27T07:03:22Z"
}`,
        sampleOutput: `{
  "ticket_id": "PL-3391",
  "source": "missed_call",
  "caller": "+1-512-555-0147",
  "captured": true
}`,
        impact: "< 2 sec missed-call capture",
      },
      {
        step: 2,
        icon: "⚙",
        title: "Urgency & Zone Triage",
        tag: "n8n Logic + Google Sheets",
        description:
          "Validates service area coverage by ZIP code against the coverage sheet. Classifies job severity as EMERGENCY or ROUTINE based on keyword analysis and time of day.",
        sampleInput: `{
  "ticket_id": "PL-3391",
  "issue": "Burst pipe under kitchen sink",
  "zip": "78704",
  "time": "07:03"
}`,
        sampleOutput: `{
  "in_service_area": true,
  "severity": "EMERGENCY",
  "zone": "Central Austin",
  "on_call_tech": "Mike R.",
  "eta_range": "20-35 min"
}`,
        impact: "Auto severity classification",
      },
      {
        step: 3,
        icon: "◈",
        title: "Instant SMS Responder",
        tag: "OpenAI GPT-4 + Twilio SMS",
        description:
          "Texts the caller within 5 seconds confirming emergency dispatch availability. Collects a photo of the issue and verifies the property address for the technician.",
        sampleInput: `{
  "ticket_id": "PL-3391",
  "caller": "+1-512-555-0147",
  "severity": "EMERGENCY",
  "eta_range": "20-35 min"
}`,
        sampleOutput: `{
  "sms_sent": true,
  "reply": "We got your call! A plumber is being dispatched now — ETA 20-35 min. Reply with a photo of the issue & confirm your address.",
  "photo_requested": true,
  "latency": "4.2s"
}`,
        impact: "5 sec SMS recovery",
      },
      {
        step: 4,
        icon: "✓",
        title: "Technician Dispatch",
        tag: "Slack + Google Maps + Board",
        description:
          "Alerts the on-call plumber with a full job brief and GPS pin on Slack. Logs the ticket in the dispatch board and sends a live ETA tracking link to the homeowner.",
        sampleInput: `{
  "ticket_id": "PL-3391",
  "tech": "Mike R.",
  "address": "2104 S Lamar Blvd, Austin",
  "severity": "EMERGENCY"
}`,
        sampleOutput: `{
  "tech_notified": true,
  "gps_pin_sent": true,
  "dispatch_board": "logged",
  "eta_link": "track.plumb.co/PL-3391",
  "homeowner_notified": true
}`,
        impact: "Zero missed emergency jobs",
      },
    ],
  },
  {
    id: "glass-cleaning-quote",
    label: "03 / Glass Cleaning Quote & Follow-Up",
    nodes: [
      {
        step: 1,
        icon: "⚡",
        title: "Quote Request Form",
        tag: "Website Form + n8n",
        description:
          "Captures residential or commercial cleaning inquiries from the website form. Extracts property type, window count, story height, access notes, and preferred frequency.",
        sampleInput: `{
  "source": "quote_form",
  "name": "David Chen",
  "phone": "+1-737-555-0263",
  "type": "residential",
  "scope": "2-story home, 24 windows + skylight",
  "frequency": "Quarterly"
}`,
        sampleOutput: `{
  "quote_id": "GC-5518",
  "status": "new",
  "property_type": "residential",
  "windows": 25,
  "stories": 2
}`,
        impact: "< 3 sec form capture",
      },
      {
        step: 2,
        icon: "⚙",
        title: "Pricing Matrix Lookup",
        tag: "Google Sheets + n8n",
        description:
          "Calculates the base quote range using the pricing matrix — factoring window count, story height multiplier, skylight surcharge, and recurring service discount rules.",
        sampleInput: `{
  "quote_id": "GC-5518",
  "windows": 25,
  "stories": 2,
  "skylight": true,
  "frequency": "Quarterly"
}`,
        sampleOutput: `{
  "base_price": "$285",
  "skylight_add": "$40",
  "recurring_discount": "-10%",
  "total_quote": "$292.50",
  "price_tier": "standard"
}`,
        impact: "Instant pricing calculation",
      },
      {
        step: 3,
        icon: "◈",
        title: "Custom Estimate & Upsell",
        tag: "OpenAI GPT-4 + WhatsApp",
        description:
          "Drafts an itemized quote breakdown and sends it via WhatsApp/email. Suggests screen and track cleaning add-ons based on property type and handles follow-up questions.",
        sampleInput: `{
  "quote_id": "GC-5518",
  "total_quote": "$292.50",
  "property_type": "residential",
  "customer": "David Chen"
}`,
        sampleOutput: `{
  "estimate_sent": true,
  "items": "24 windows + 1 skylight + track cleaning add-on",
  "upsell_accepted": "track_cleaning",
  "revised_total": "$332.50",
  "questions_handled": 2
}`,
        impact: "Automated quote delivery",
      },
      {
        step: 4,
        icon: "✓",
        title: "Booking & Follow-Up",
        tag: "Cal.com + n8n Sequences",
        description:
          "Sends a one-click approval and booking link. If unopened after 48 hours, triggers an automated follow-up sequence. Schedules recurring service reminders for quarterly clients.",
        sampleInput: `{
  "quote_id": "GC-5518",
  "revised_total": "$332.50",
  "customer": "David Chen",
  "phone": "+1-737-555-0263"
}`,
        sampleOutput: `{
  "booking_link_sent": true,
  "approved": true,
  "scheduled_date": "2024-12-14",
  "followup_48h": "armed",
  "recurring_reminder": "Quarterly"
}`,
        impact: "Instant quote-to-booking",
      },
    ],
  },
];

/* ─── Style helpers ────────────────────────────────────────── */
const mono: React.CSSProperties = { fontFamily: "var(--font-mono, monospace)" };
const dim = (a: number) => `rgba(255,255,255,${a})`;

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export function AutomationSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeNode, setActiveNode] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(-1);
  const [simDone, setSimDone] = useState(false);
  const nodeEls = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const workflow = WORKFLOWS[activeTab];
  const node = workflow.nodes[activeNode];

  /* ── Tab switch ─────────────────────────────────────────── */
  const switchTab = useCallback(
    (idx: number) => {
      if (simulating) return;
      setActiveTab(idx);
      setActiveNode(0);
      setSimDone(false);
      setSimStep(-1);
    },
    [simulating],
  );

  /* ── Run simulation ─────────────────────────────────────── */
  const runSim = useCallback(() => {
    if (simulating) return;
    setSimulating(true);
    setSimDone(false);
    setSimStep(0);
    setActiveNode(0);

    let step = 0;
    const iv = setInterval(() => {
      step += 1;
      if (step < 4) {
        setSimStep(step);
        setActiveNode(step);
      } else {
        clearInterval(iv);
        setSimStep(-1);
        setSimDone(true);
        setActiveNode(3);
        setSimulating(false);
      }
    }, 500);
  }, [simulating]);

  /* ── GSAP subtle entrance on scroll ─────────────────────── */
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      ctx = gsap.context(() => {
        gsap.from(sectionRef.current, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }, sectionRef);
    })();

    return () => { ctx?.revert(); };
  }, []);

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      id="automation"
      className="relative w-full"
      style={{ background: "#080808", padding: "clamp(80px, 12vw, 160px) 0" }}
    >
      {/* ── Section header ──────────────────────────────────── */}
      <div className="mx-auto px-5 sm:px-8 md:px-14" style={{ maxWidth: 1120 }}>
        <p
          style={{
            ...mono,
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: dim(0.3),
            marginBottom: 12,
          }}
        >
          03 / Automation
        </p>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: dim(0.92),
            margin: 0,
          }}
        >
          Automation Studio
        </h2>
        <p
          style={{
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: dim(0.45),
            lineHeight: 1.6,
            maxWidth: 540,
            marginTop: 14,
          }}
        >
          Real workflows I build for clients — click any node to inspect the
          data flowing through it.
        </p>
      </div>

      {/* ── Studio Card ─────────────────────────────────────── */}
      <div
        className="mx-auto mt-10 sm:mt-14"
        style={{
          maxWidth: 1120,
          padding: "0 clamp(12px, 2vw, 56px)",
        }}
      >
        <div
          style={{
            border: `1px solid ${dim(0.08)}`,
            borderRadius: 12,
            background: "#0e0e0e",
            overflow: "hidden",
          }}
        >
          {/* ── Top bar: tabs + status + run button ──────────── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 0,
              borderBottom: `1px solid ${dim(0.07)}`,
              background: "rgba(255,255,255,0.012)",
            }}
          >
            {/* Workflow tabs */}
            <div
              className="hide-scrollbar"
              style={{
                display: "flex",
                gap: 2,
                padding: "8px 10px",
                overflowX: "auto",
                flex: "1 1 auto",
                minWidth: 0,
              }}
            >
              {WORKFLOWS.map((w, i) => (
                <button
                  key={w.id}
                  onClick={() => switchTab(i)}
                  style={{
                    ...mono,
                    fontSize: "clamp(9px, 1vw, 11px)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    padding: "6px 14px",
                    borderRadius: 100,
                    border: `1px solid ${i === activeTab ? dim(0.25) : "transparent"}`,
                    background: i === activeTab ? dim(0.06) : "transparent",
                    color: i === activeTab ? dim(0.85) : dim(0.35),
                    cursor: simulating ? "default" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>

            {/* Status badge + Run button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 14px 8px 6px",
                flexShrink: 0,
              }}
            >
              <span
                className="hidden sm:flex"
                style={{
                  ...mono,
                  fontSize: 8,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: dim(0.25),
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#4ade80",
                    display: "inline-block",
                    animation: "pulse-dot 2s ease infinite",
                  }}
                />
                Interactive Preview&ensp;·&ensp;Click Any Node
              </span>

              <button
                onClick={runSim}
                disabled={simulating}
                style={{
                  ...mono,
                  fontSize: "clamp(8px, 0.9vw, 10px)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "6px 16px",
                  borderRadius: 6,
                  border: `1px solid ${dim(simulating ? 0.06 : 0.18)}`,
                  background: simulating ? dim(0.03) : "transparent",
                  color: simulating ? dim(0.3) : dim(0.65),
                  cursor: simulating ? "wait" : "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {simulating ? "Running…" : simDone ? "✓ Complete" : "▶ Run Test Flow"}
              </button>
            </div>
          </div>

          {/* ── Pipeline Nodes Row ───────────────────────────── */}
          <div style={{ padding: "clamp(20px, 3vw, 36px) clamp(14px, 2.5vw, 32px)" }}>
            {/* Desktop: horizontal | Mobile: vertical */}
            <div
              className="pipeline-nodes"
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 0,
              }}
            >
              {workflow.nodes.map((n, i) => {
                const isActive = i === activeNode;
                const isPulsing = simulating && i === simStep;

                return (
                  <div
                    key={`${workflow.id}-${i}`}
                    className="pipeline-node-wrapper"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    {/* Node button */}
                    <button
                      ref={(el) => { nodeEls.current[i] = el; }}
                      onClick={() => {
                        if (!simulating) {
                          setActiveNode(i);
                          setSimDone(false);
                        }
                      }}
                      className="pipeline-node-btn"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "clamp(6px, 0.8vw, 10px)",
                        padding: "clamp(10px, 1.5vw, 18px) clamp(8px, 1.2vw, 16px)",
                        borderRadius: 10,
                        border: `1.5px solid ${
                          isPulsing
                            ? "rgba(74,222,128,0.6)"
                            : isActive
                              ? dim(0.3)
                              : dim(0.06)
                        }`,
                        background: isPulsing
                          ? "rgba(74,222,128,0.06)"
                          : isActive
                            ? dim(0.04)
                            : "transparent",
                        cursor: simulating ? "default" : "pointer",
                        transition: "all 0.25s ease",
                        position: "relative",
                        flexShrink: 0,
                        width: "clamp(72px, 10vw, 110px)",
                        boxShadow: isPulsing
                          ? "0 0 20px rgba(74,222,128,0.12)"
                          : isActive
                            ? `0 0 24px ${dim(0.04)}`
                            : "none",
                      }}
                    >
                      {/* Step badge */}
                      <span
                        style={{
                          ...mono,
                          fontSize: "clamp(7px, 0.7vw, 8px)",
                          color: isPulsing ? "rgba(74,222,128,0.8)" : dim(0.3),
                          letterSpacing: "0.15em",
                          position: "absolute",
                          top: 5,
                          right: 7,
                        }}
                      >
                        {String(n.step).padStart(2, "0")}
                      </span>

                      {/* Icon */}
                      <span
                        style={{
                          fontSize: "clamp(18px, 2.2vw, 26px)",
                          color: isPulsing
                            ? "rgba(74,222,128,0.9)"
                            : isActive
                              ? dim(0.8)
                              : dim(0.45),
                          transition: "color 0.2s ease",
                        }}
                      >
                        {n.icon}
                      </span>

                      {/* Title */}
                      <span
                        style={{
                          fontSize: "clamp(9px, 1vw, 12px)",
                          fontWeight: 500,
                          color: isActive ? dim(0.85) : dim(0.5),
                          textAlign: "center",
                          lineHeight: 1.25,
                          transition: "color 0.2s ease",
                        }}
                      >
                        {n.title}
                      </span>

                      {/* Tech tag */}
                      <span
                        style={{
                          ...mono,
                          fontSize: "clamp(7px, 0.7vw, 8.5px)",
                          color: dim(0.28),
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}
                      >
                        {n.tag}
                      </span>
                    </button>

                    {/* Connecting line (not after last node) */}
                    {i < 3 && (
                      <div
                        className="pipeline-connector"
                        style={{
                          flex: 1,
                          height: 1,
                          minWidth: 8,
                          position: "relative",
                          margin: "0 -1px",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 1,
                            background: `linear-gradient(to right, ${dim(0.15)}, ${dim(0.08)})`,
                          }}
                        />
                        {/* Animated pulse dot during simulation */}
                        {simulating && simStep === i && (
                          <div
                            style={{
                              position: "absolute",
                              top: -3,
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: "#4ade80",
                              boxShadow: "0 0 8px rgba(74,222,128,0.5)",
                              animation: "pulse-travel 0.5s ease forwards",
                            }}
                          />
                        )}
                        {/* Arrow head */}
                        <div
                          style={{
                            position: "absolute",
                            right: -1,
                            top: -3,
                            width: 0,
                            height: 0,
                            borderLeft: `5px solid ${dim(0.12)}`,
                            borderTop: "3.5px solid transparent",
                            borderBottom: "3.5px solid transparent",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Inspector Panel ─────────────────────────────── */}
            <div
              style={{
                marginTop: "clamp(18px, 2.5vw, 30px)",
                border: `1px solid ${dim(0.07)}`,
                borderRadius: 10,
                background: "#0a0a0a",
                overflow: "hidden",
              }}
            >
              {/* Inspector header */}
              <div
                style={{
                  padding: "clamp(10px, 1.4vw, 16px) clamp(14px, 2vw, 22px)",
                  borderBottom: `1px solid ${dim(0.06)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      ...mono,
                      fontSize: "clamp(8px, 0.8vw, 10px)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: dim(0.3),
                    }}
                  >
                    Node Inspector
                  </span>
                  <span
                    style={{
                      ...mono,
                      fontSize: "clamp(8px, 0.8vw, 10px)",
                      color: dim(0.5),
                      padding: "2px 8px",
                      borderRadius: 4,
                      border: `1px solid ${dim(0.1)}`,
                      background: dim(0.02),
                    }}
                  >
                    Step {node.step} — {node.title}
                  </span>
                </div>
                <span
                  style={{
                    ...mono,
                    fontSize: "clamp(7px, 0.7vw, 9px)",
                    color: dim(0.2),
                    letterSpacing: "0.12em",
                  }}
                >
                  {node.tag}
                </span>
              </div>

              {/* Inspector body */}
              <div
                className="inspector-body"
                style={{
                  display: "grid",
                  gap: 0,
                }}
              >
                {/* Left: description */}
                <div
                  className="inspector-desc"
                  style={{
                    padding: "clamp(14px, 2vw, 22px)",
                    borderBottom: `1px solid ${dim(0.05)}`,
                  }}
                >
                  <p
                    style={{
                      ...mono,
                      fontSize: "clamp(7px, 0.7vw, 9px)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: dim(0.25),
                      margin: "0 0 8px",
                    }}
                  >
                    What Happens Here
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(12px, 1.2vw, 14px)",
                      color: dim(0.65),
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {node.description}
                  </p>
                </div>

                {/* Right: code blocks */}
                <div
                  className="inspector-data"
                  style={{
                    display: "grid",
                    gap: 0,
                  }}
                >
                  {/* Sample Input */}
                  <div
                    style={{
                      padding: "clamp(12px, 1.6vw, 18px)",
                      borderBottom: `1px solid ${dim(0.04)}`,
                    }}
                  >
                    <p
                      style={{
                        ...mono,
                        fontSize: "clamp(7px, 0.7vw, 8px)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: dim(0.22),
                        margin: "0 0 8px",
                      }}
                    >
                      Sample Input
                    </p>
                    <pre
                      className="hide-scrollbar"
                      style={{
                        ...mono,
                        fontSize: "clamp(9px, 0.85vw, 11px)",
                        color: dim(0.52),
                        lineHeight: 1.55,
                        margin: 0,
                        padding: "10px 12px",
                        borderRadius: 6,
                        background: dim(0.025),
                        border: `1px solid ${dim(0.04)}`,
                        overflowX: "auto",
                        whiteSpace: "pre",
                      }}
                    >
                      {node.sampleInput}
                    </pre>
                  </div>

                  {/* Sample Output */}
                  <div
                    style={{
                      padding: "clamp(12px, 1.6vw, 18px)",
                    }}
                  >
                    <p
                      style={{
                        ...mono,
                        fontSize: "clamp(7px, 0.7vw, 8px)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: dim(0.22),
                        margin: "0 0 8px",
                      }}
                    >
                      {simDone && activeNode === 3 ? "Final Output" : "Sample Output"}
                    </p>
                    <pre
                      className="hide-scrollbar"
                      style={{
                        ...mono,
                        fontSize: "clamp(9px, 0.85vw, 11px)",
                        color: simDone && activeNode === 3 ? "rgba(74,222,128,0.7)" : dim(0.52),
                        lineHeight: 1.55,
                        margin: 0,
                        padding: "10px 12px",
                        borderRadius: 6,
                        background: simDone && activeNode === 3 ? "rgba(74,222,128,0.03)" : dim(0.025),
                        border: `1px solid ${simDone && activeNode === 3 ? "rgba(74,222,128,0.12)" : dim(0.04)}`,
                        overflowX: "auto",
                        whiteSpace: "pre",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {node.sampleOutput}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Impact pill footer */}
              <div
                style={{
                  padding: "clamp(10px, 1.2vw, 14px) clamp(14px, 2vw, 22px)",
                  borderTop: `1px solid ${dim(0.05)}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#4ade80",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    ...mono,
                    fontSize: "clamp(9px, 0.85vw, 11px)",
                    letterSpacing: "0.08em",
                    color: dim(0.55),
                  }}
                >
                  {node.impact}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Disclaimer ─────────────────────────────────────── */}
      <p
        className="mx-auto mt-6 px-5 sm:px-8 md:px-14"
        style={{
          ...mono,
          maxWidth: 1120,
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: dim(0.17),
        }}
      >
        Simulated demonstration · Not a live integration
      </p>

      {/* ── Responsive CSS & animations (injected once) ───── */}
      <style jsx global>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes pulse-travel {
          0% { left: 0; opacity: 1; }
          100% { left: calc(100% - 7px); opacity: 0; }
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Desktop: horizontal pipeline */
        .pipeline-nodes {
          flex-direction: row;
          align-items: center;
        }
        .pipeline-connector {
          display: block;
        }

        /* Inspector: 2 columns on desktop */
        .inspector-body {
          grid-template-columns: 1fr 1fr;
        }
        .inspector-desc {
          border-right: 1px solid rgba(255,255,255,0.05);
          border-bottom: none !important;
        }
        .inspector-data {
          grid-template-columns: 1fr;
        }

        /* ── Mobile ──────────────────────────── */
        @media (max-width: 768px) {
          .pipeline-nodes {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .pipeline-node-wrapper {
            flex-direction: column !important;
            align-items: center !important;
          }
          .pipeline-node-btn {
            width: 100% !important;
            flex-direction: row !important;
            justify-content: flex-start !important;
            gap: 12px !important;
            padding: 12px 16px !important;
          }
          .pipeline-connector {
            height: 20px !important;
            width: 1px !important;
            min-width: 1px !important;
            margin: 0 auto !important;
          }
          .pipeline-connector > div:first-child {
            width: 1px !important;
            height: 100% !important;
            top: 0 !important;
            left: 50% !important;
            right: auto !important;
            background: linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.08)) !important;
          }
          .pipeline-connector > div:last-child {
            /* arrow pointing down */
            right: auto !important;
            left: calc(50% - 3.5px) !important;
            top: auto !important;
            bottom: -1px !important;
            border-left: 3.5px solid transparent !important;
            border-right: 3.5px solid transparent !important;
            border-top: 5px solid rgba(255,255,255,0.12) !important;
            border-bottom: none !important;
          }

          /* Inspector: single column */
          .inspector-body {
            grid-template-columns: 1fr !important;
          }
          .inspector-desc {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.05) !important;
          }
        }
      `}</style>
    </section>
  );
}
