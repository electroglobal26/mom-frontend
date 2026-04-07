"use client"

/*
  ┌──────────────────────────────────────────────────────────────────┐
  │  WORK PAGE                                                       │
  │                                                                  │
  │  Sections:                                                       │
  │  1. Heading — eyebrow + h1 + underline                          │
  │  2. Case study cards — same beautiful card design as CaseStudies │
  │  3. Team section — image + bio card, properly laid out          │
  │  4. Testimonials — 3-col quote cards with avatar initials       │
  │                                                                  │
  │  Motion — inlined scroll state machine (idle/visible/resting)   │
  │  Hover — useState for cards, CSS for links                      │
  └──────────────────────────────────────────────────────────────────┘
*/

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { caseStudies, teamMember, testimonials } from "@lib/data/case-studies"
import { Epilogue, Outfit, Mansalva } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit   = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

// ── Scroll state machine (inlined) ───────────────────────────────────────────

type ScrollState = "idle" | "visible" | "resting"

function useScrollState(amount = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<ScrollState>("idle")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible")
        } else {
          setState((prev) => (prev === "idle" ? "idle" : "resting"))
        }
      },
      { threshold: amount, rootMargin: "0px 0px -40px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [amount])

  return { ref, state }
}

function Reveal({
  children, delay = 0, offset = 36, amount = 0.2, className = "",
}: {
  children: React.ReactNode; delay?: number; offset?: number
  amount?: number; className?: string
}) {
  const { ref, state } = useScrollState(amount)
  return (
    <motion.div
      ref={ref}
      className={className}
      style={state === "idle" ? { opacity: 0 } : undefined}
      animate={
        state === "visible"
          ? { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const } }
          : state === "resting"
          ? { opacity: 1, y: 0, transition: { duration: 0 } }
          : { opacity: 0, y: offset, transition: { duration: 0 } }
      }
    >
      {children}
    </motion.div>
  )
}

// Underline scroll state (drives CSS width animation)
function useUnderlineState() {
  const ref = useRef<HTMLSpanElement>(null)
  const [state, setState] = useState<ScrollState>("idle")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setState("visible")
        else setState((prev) => (prev === "idle" ? "idle" : "resting"))
      },
      { threshold: 0.8 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, state }
}

// ── Accent colours for case study cards ──────────────────────────────────────

const ACCENTS = [
  { accent: "#e61e73", pillBg: "#fff0f6", pillHoverBg: "#ffe0ef", pillBorder: "#fbb6d4" },
  { accent: "#9333ea", pillBg: "#f5eeff", pillHoverBg: "#ede0ff", pillBorder: "#d8b4fe" },
  { accent: "#0ea5e9", pillBg: "#e8f6ff", pillHoverBg: "#d0edff", pillBorder: "#7dd3fc" },
]

const MotionArticle = motion.create("article" as never) as typeof motion.div

// ── Component ─────────────────────────────────────────────────────────────────

export default function WorkPage({ params }: { params: { countryCode: string } }) {
  const { countryCode } = params
  const prefersReduced = useReducedMotion()

  // Case study card hover
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Testimonial card hover
  const [hoveredTestimonial, setHoveredTestimonial] = useState<number | null>(null)

  // Heading underline
  const { ref: underlineRef, state: underlineState } = useUnderlineState()

  // Team heading underline
  const { ref: teamUnderlineRef, state: teamUnderlineState } = useUnderlineState()

  return (
    <main className="relative overflow-hidden bg-[#f3f4f6] pt-16 pb-20 lg:pt-20 lg:pb-24">

      <style>{`
        /* ── Page underlines ── */
        @keyframes strokeIn {
          from { width:0%; opacity:0; }
          to   { width:var(--ul-w, 58%); opacity:1; }
        }
        .page-underline {
          position:absolute; bottom:8px; left:0; z-index:-1;
          height:15px; border-radius:2px; background:var(--ul-color, #ef6a99);
          width:var(--ul-w, 58%); opacity:1;
        }
        .page-underline.idle    { width:0%; opacity:0; }
        .page-underline.visible { animation:strokeIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s forwards; }

        /* ── Case study card ── */
        .cs-card {
          position:relative; background:#fff; border-radius:20px;
          overflow:hidden; display:flex; flex-direction:column;
          transition:border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .cs-card::before {
          content:""; position:absolute; top:0; left:0; right:0; height:4px;
          border-radius:20px 20px 0 0; background:var(--card-accent);
          opacity:0; transition:opacity 0.25s ease; z-index:10;
        }
        .cs-card.is-hovered::before { opacity:1; }

        .cs-img-zone {
          position:relative; overflow:hidden; aspect-ratio:16/10;
          background:#f0f0f0; flex-shrink:0; display:block;
        }
        .cs-img-zone img { transition:transform 0.6s ease !important; }
        .cs-card.is-hovered .cs-img-zone img { transform:scale(1.05) !important; }

        .cs-pill {
          display:inline-flex; align-items:center; padding:4px 12px;
          border-radius:999px; font-size:13px; font-weight:700;
          background:var(--pill-bg); color:var(--card-accent);
          border:1.5px solid var(--pill-border);
          transition:background 0.2s ease, border-color 0.2s ease;
        }
        .cs-card.is-hovered .cs-pill { background:var(--pill-hover-bg); border-color:var(--card-accent); }

        .cs-content { padding:22px 24px 28px; display:flex; flex-direction:column; flex:1; }
        .cs-divider { height:1px; background:#f0f0f0; margin:16px 0; }

        .cs-view-link {
          display:inline-flex; align-items:center; gap:6px; font-size:13px;
          font-weight:800; letter-spacing:0.04em; text-transform:uppercase;
          text-decoration:none; color:var(--card-accent);
          margin-top:auto; padding-top:18px;
          transition:opacity 0.2s ease;
        }
        .cs-view-link:hover { opacity:0.7; }
        .cs-view-link .link-arrow { display:inline-block; transition:transform 0.2s ease; }
        .cs-view-link:hover .link-arrow { transform:translateX(5px); }

        .cs-title-link { text-decoration:none; color:#0e2547; transition:color 0.2s ease; }
        .cs-card.is-hovered .cs-title-link { color:var(--card-accent); }

        .cs-doodle { position:absolute; top:-4px; right:14px; z-index:20; pointer-events:none; }

        /* ── Team card ── */
        .team-card {
          overflow:hidden; border-radius:24px; background:#fff;
          box-shadow:0 22px 55px rgba(0,0,0,0.07);
          display:grid;
          transition:box-shadow 0.3s ease;
        }
        .team-card:hover { box-shadow:0 32px 72px rgba(0,0,0,0.11); }

        /* ── Testimonial card ── */
        .testi-card {
          background:#fff; border-radius:20px; padding:28px;
          border:1.5px solid #ebebeb;
          display:flex; flex-direction:column; gap:20px;
          transition:border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .testi-card.is-hovered {
          border-color:var(--tcard-accent);
          box-shadow:0 16px 44px rgba(0,0,0,0.09);
        }
        .testi-card::before {
          content:open-quote; font-size:72px; line-height:1; color:var(--tcard-accent);
          opacity:0.18; font-family:Georgia,serif; display:block;
          margin-bottom:-28px; margin-top:-8px;
        }
        .testi-quote { font-size:16px; line-height:1.8; color:#475569; font-style:italic; }
        .testi-author { display:flex; align-items:center; gap:12px; margin-top:auto; }
        .testi-avatar {
          width:42px; height:42px; border-radius:50%; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:15px; font-weight:700; color:#fff;
          background:var(--tcard-accent);
        }
        .testi-name { font-size:14px; font-weight:700; color:#0e2547; }
        .testi-role { font-size:12px; color:#94a3b8; margin-top:2px; }
      `}</style>

      {/* background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-[8%] h-[140px] w-[420px] rounded-full bg-white/45 blur-3xl" />
        <div className="absolute right-[6%] top-[10%] h-[150px] w-[360px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[18%] bottom-[8%] h-[110px] w-[420px] rounded-full bg-white/35 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          {/* ══════════════════════════════════════════
              HEADING
          ══════════════════════════════════════════ */}
          <div className="max-w-[760px]">
            <Reveal offset={20} amount={0.5}>
              <p className={`${mansalva.className} mb-4 text-[24px] font-bold leading-none text-[#e61e73] sm:text-[28px]`}>
                CASE STUDIES
              </p>
            </Reveal>

            <Reveal delay={0.08} offset={24} amount={0.5}>
              <h1 className={`${epilogue.className} text-[42px] font-extrabold leading-[0.95] tracking-[-0.065em] text-[#0e2547] sm:text-[56px] lg:text-[76px]`}>
                <span className="relative inline-block">
                  Real brands. Real growth.
                  <span
                    ref={underlineRef}
                    className={`page-underline ${underlineState === "resting" ? "" : underlineState}`}
                    style={{ "--ul-w": "58%", "--ul-color": "#ef6a99" } as React.CSSProperties}
                  />
                </span>
              </h1>
            </Reveal>
          </div>

          {/* ══════════════════════════════════════════
              CASE STUDY CARDS
          ══════════════════════════════════════════ */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {caseStudies.map((item, idx) => {
              const theme = ACCENTS[idx % ACCENTS.length]
              const isHov = hoveredCard === idx

              return (
                <Reveal key={item.slug} delay={idx * 0.09} offset={44} amount={0.08}>
                  <MotionArticle
                    className={`cs-card h-full${isHov ? " is-hovered" : ""}`}
                    style={{
                      "--card-accent":   theme.accent,
                      "--pill-bg":       theme.pillBg,
                      "--pill-hover-bg": theme.pillHoverBg,
                      "--pill-border":   theme.pillBorder,
                      border: `1.5px solid ${isHov ? theme.accent : "#ebebeb"}`,
                      boxShadow: isHov
                        ? "0 24px 60px rgba(0,0,0,0.12)"
                        : "0 4px 16px rgba(0,0,0,0.04)",
                    } as React.CSSProperties}
                    whileHover={prefersReduced ? {} : {
                      y: -8,
                      transition: { duration: 0.22, ease: "easeOut" },
                    }}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Image */}
                    <Link href={`/${countryCode}/work/${item.slug}`} className="cs-img-zone" tabIndex={-1}>
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      {/* gradient overlay */}
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
                        style={{ background: "linear-gradient(to top,rgba(14,37,71,0.38) 0%,transparent 100%)" }}
                      />
                      {/* pink bars doodle */}
                      <div className="cs-doodle">
                        <svg width="58" height="40" viewBox="0 0 82 54" fill="none">
                          <path
                            d="M8 44C14 20 14 8 14 2M24 46C30 24 30 11 30 4M40 48C46 26 46 13 46 6M56 48C62 28 62 16 62 10M72 46C76 30 76 20 76 14"
                            stroke={theme.accent} strokeWidth="4" strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="cs-content">
                      <div className="mb-3">
                        <span className={`${outfit.className} cs-pill`}>{item.category}</span>
                      </div>

                      <h2 className={`${epilogue.className} text-[22px] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#0e2547] lg:text-[26px]`}>
                        <Link href={`/${countryCode}/work/${item.slug}`} className="cs-title-link">
                          {item.title}
                        </Link>
                      </h2>

                      {item.about && (
                        <p className={`${outfit.className} mt-3 text-[14px] leading-[1.75] text-slate-400`}>
                          {item.about}
                        </p>
                      )}

                      <div className="cs-divider" />

                      {/* Results — if available */}
                      {item.results && item.results.length > 0 && (
                        <>
                          <p className={`${epilogue.className} mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400`}>
                            Results
                          </p>
                          <ul className="mb-2 space-y-1.5">
                            {item.results.slice(0, 3).map((r) => (
                              <li key={r} className={`${outfit.className} flex items-start gap-2 text-[13px] leading-[1.6] text-slate-500`}>
                                <span className="mt-[5px] h-[6px] w-[6px] flex-shrink-0 rounded-full" style={{ background: theme.accent, opacity: 0.7 }} />
                                {r}
                              </li>
                            ))}
                          </ul>
                          <div className="cs-divider" />
                        </>
                      )}

                      <Link href={`/${countryCode}/work/${item.slug}`} className={`${epilogue.className} cs-view-link`}>
                        View Case Study
                        <span className="link-arrow">→</span>
                      </Link>
                    </div>
                  </MotionArticle>
                </Reveal>
              )
            })}
          </div>

          {/* ══════════════════════════════════════════
              TEAM SECTION
          ══════════════════════════════════════════ */}
          <section className="mt-24">
            <Reveal offset={24} amount={0.4}>
              <div className="max-w-[760px]">
                <p className={`${mansalva.className} mb-4 text-[24px] font-bold leading-none text-[#e61e73]`}>
                  THE TEAM
                </p>
                <h2 className={`${epilogue.className} text-[38px] font-extrabold leading-[1] tracking-[-0.05em] text-[#0e2547] lg:text-[52px]`}>
                  <span className="relative inline-block">
                    The team behind your growth
                    <span
                      ref={teamUnderlineRef}
                      className={`page-underline ${teamUnderlineState === "resting" ? "" : teamUnderlineState}`}
                      style={{ "--ul-w": "72%", "--ul-color": "#99dcf8" } as React.CSSProperties}
                    />
                  </span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.12} offset={32} amount={0.15}>
              <div className="team-card mt-10 lg:grid-cols-[340px_1fr]">

                {/* Photo */}
                <div className="relative min-h-[360px] bg-[#eef0f2] lg:min-h-[440px]">
                  <Image
                    src={teamMember.image}
                    alt={teamMember.name}
                    fill
                    className="object-cover"
                  />
                  {/* gradient overlay at bottom of photo */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
                    style={{ background: "linear-gradient(to top,rgba(14,37,71,0.45) 0%,transparent 100%)" }}
                  />
                  {/* name badge overlaid on photo */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className={`${epilogue.className} text-[22px] font-extrabold text-white`}>{teamMember.name}</p>
                    <p className={`${outfit.className} mt-0.5 text-[14px] font-medium text-[#ef6a99]`}>{teamMember.role}</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  {/* accent bar */}
                  <div className="mb-6 h-[4px] w-[48px] rounded-full bg-[#e61e73]" />

                  <p className={`${outfit.className} text-[17px] leading-9 text-slate-500 lg:text-[18px]`}>
                    {teamMember.description}
                  </p>

                  {/* social links — if available in data */}
                  {(teamMember as any).socials && (
                    <div className="mt-8 flex gap-4">
                      {((teamMember as any).socials as { label: string; href: string }[]).map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${outfit.className} inline-flex items-center gap-1.5 rounded-[10px] border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-600 transition hover:border-[#e61e73] hover:text-[#e61e73]`}
                        >
                          {s.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </Reveal>
          </section>

          {/* ══════════════════════════════════════════
              TESTIMONIALS
          ══════════════════════════════════════════ */}
          <section className="mt-24">
            <Reveal offset={24} amount={0.4}>
              <h2 className={`${epilogue.className} mb-10 text-[34px] font-extrabold leading-[1] tracking-[-0.05em] text-[#0e2547] lg:text-[48px]`}>
                What our clients say
              </h2>
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-3">
              {testimonials.map((item, idx) => {
                const accentColors = ["#e61e73", "#9333ea", "#0ea5e9"]
                const accent = accentColors[idx % accentColors.length]
                const isHov = hoveredTestimonial === idx

                // Initials from author name
                const initials = item.author
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()

                return (
                  <Reveal key={item.author} delay={idx * 0.1} offset={32} amount={0.2}>
                    <motion.div
                      className={`testi-card h-full${isHov ? " is-hovered" : ""}`}
                      style={{ "--tcard-accent": accent } as React.CSSProperties}
                      whileHover={prefersReduced ? {} : {
                        y: -6,
                        transition: { duration: 0.22, ease: "easeOut" },
                      }}
                      onMouseEnter={() => setHoveredTestimonial(idx)}
                      onMouseLeave={() => setHoveredTestimonial(null)}
                    >
                      <p className={`${outfit.className} testi-quote`}>
                        &ldquo;{item.quote}&rdquo;
                      </p>

                      <div className="testi-author">
                        <div className="testi-avatar">{initials}</div>
                        <div>
                          <p className={`${epilogue.className} testi-name`}>{item.author}</p>
                          {(item as any).role && (
                            <p className={`${outfit.className} testi-role`}>{(item as any).role}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                )
              })}
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}