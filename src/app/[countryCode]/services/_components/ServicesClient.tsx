"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Epilogue, Outfit, Mansalva } from "next/font/google"
import type { Service } from "@lib/data/services"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit   = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

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

const ACCENTS = [
  { accent: "#e61e73", light: "#fff0f6", border: "#fbb6d4", num: "#f9a8d4" },
  { accent: "#9333ea", light: "#f5eeff", border: "#d8b4fe", num: "#c4b5fd" },
  { accent: "#0ea5e9", light: "#e8f6ff", border: "#7dd3fc", num: "#93c5fd" },
  { accent: "#49d7a4", light: "#e8fdf5", border: "#6ee7b7", num: "#6ee7b7" },
  { accent: "#f59e0b", light: "#fffbeb", border: "#fde68a", num: "#fcd34d" },
  { accent: "#ef4444", light: "#fff5f5", border: "#fca5a5", num: "#fca5a5" },
]

const MotionArticle = motion.create("article" as never) as typeof motion.div

export default function ServicesClient({ services }: { services: Service[] }) {
  const prefersReduced = useReducedMotion()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <main className="relative overflow-hidden bg-[#f3f4f6] pt-16 pb-20 lg:pt-20 lg:pb-24">
      <style>{`
        .svc-card {
          position: relative;
          background: #fff;
          border-radius: 22px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .svc-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          border-radius: 22px 22px 0 0;
          background: var(--card-accent);
          opacity: 0;
          transition: opacity 0.25s ease;
          z-index: 10;
        }
        .svc-card.is-hovered::before { opacity: 1; }
        .svc-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          background: var(--card-light);
          color: var(--card-accent);
          border: 1.5px solid var(--card-border);
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .svc-card.is-hovered .svc-pill {
          background: var(--card-accent);
          color: #fff;
          border-color: var(--card-accent);
        }
        .svc-num {
          font-size: 18px;
          font-weight: 800;
          color: var(--card-num);
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .svc-card.is-hovered .svc-num {
          color: var(--card-accent);
          transform: scale(1.1);
        }
        .svc-dot {
          margin-top: 10px;
          width: 8px; height: 8px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #cbd5e1;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .svc-card.is-hovered .svc-dot {
          background: var(--card-accent);
          transform: scale(1.2);
        }
        .svc-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--card-accent);
          border: 2px solid var(--card-border);
          background: transparent;
          overflow: hidden;
          transition: color 0.25s ease, box-shadow 0.25s ease;
          margin-top: auto;
        }
        .svc-cta::before {
          content: "";
          position: absolute; inset: 0;
          background: var(--card-accent);
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 0;
        }
        .svc-cta:hover::before { transform: translateX(0); }
        .svc-cta:hover { color: #fff; box-shadow: 0 6px 20px rgba(15,23,42,0.12); }
        .svc-cta:active { transform: translateY(1px); }
        .svc-cta .cta-label,
        .svc-cta .cta-arrow { position: relative; z-index: 1; }
        .svc-cta .cta-arrow {
          display: inline-block;
          font-size: 16px;
          transition: transform 0.22s ease;
        }
        .svc-cta:hover .cta-arrow { transform: translateX(4px); }
        .svc-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 18px 0 16px;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-[10%] h-[140px] w-[420px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute right-[8%] top-[16%] h-[150px] w-[360px] rounded-full bg-white/35 blur-3xl" />
        <div className="absolute left-[18%] bottom-[10%] h-[120px] w-[400px] rounded-full bg-white/30 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          <div className="w-full">
            <Reveal offset={20} amount={0.5}>
              <p className={`${mansalva.className} mb-5 text-[24px] font-bold leading-none text-[#e61e73]`}>
                Our Services
              </p>
            </Reveal>

            <Reveal delay={0.08} offset={28} amount={0.4}>
              <h1 className={`${epilogue.className} w-full text-[48px] font-extrabold leading-[0.95] tracking-[-0.065em] text-[#0e2547] sm:text-[62px] lg:text-[82px] xl:text-[92px]`}>
                <span className="block">Services designed to</span>
                <span className="block">
                  build{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">stronger brands</span>
                    <motion.span
                      className="absolute bottom-[4px] left-[-4px] right-[-4px] -z-10 h-[18px] rounded-[3px] bg-[#ef6a99]"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: false, amount: 0.8 }}
                      transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                      style={{ transformOrigin: "left center" }}
                    />
                  </span>
                </span>
                <span className={`${outfit.className} mt-3 block text-[22px] font-medium leading-[1.5] tracking-[-0.01em] text-slate-400 sm:text-[26px] lg:text-[30px]`}>
                  and sharper growth systems.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.18} offset={16} amount={0.4}>
              <div className="mt-8 flex flex-col gap-6 border-t border-slate-200 pt-8 lg:flex-row lg:items-start lg:gap-16">
                <div className="flex-shrink-0">
                  <p className={`${epilogue.className} text-[48px] font-extrabold leading-none tracking-[-0.05em] text-[#0e2547] lg:text-[64px]`}>
                    {services.length}+
                  </p>
                  <p className={`${outfit.className} mt-1 text-[14px] font-medium text-slate-400`}>
                    Service areas
                  </p>
                </div>
                <div className="hidden w-[1px] self-stretch bg-slate-200 lg:block" />
                <p className={`${outfit.className} max-w-[820px] text-[17px] leading-9 text-slate-500 lg:text-[18px]`}>
                  From UX/UI and websites to SEO, content, strategy, and paid growth,
                  our services are built to improve communication, performance, and
                  long-term brand momentum. We keep the work clear, premium, and
                  aligned with business outcomes.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((item, index) => {
              const theme  = ACCENTS[index % ACCENTS.length]
              const isHov  = hoveredCard === index
              const padNum = String(index + 1).padStart(2, "0")

              return (
                <Reveal key={item.slug} delay={index * 0.08} offset={40} amount={0.1}>
                  <MotionArticle
                    className={`svc-card h-full${isHov ? " is-hovered" : ""}`}
                    style={{
                      "--card-accent":  theme.accent,
                      "--card-light":   theme.light,
                      "--card-border":  theme.border,
                      "--card-num":     theme.num,
                      border: `1.5px solid ${isHov ? theme.accent : "#e8ecf0"}`,
                      boxShadow: isHov
                        ? `0 20px 56px rgba(0,0,0,0.10), 0 0 0 1px ${theme.border}`
                        : "0 8px 28px rgba(0,0,0,0.05)",
                    } as React.CSSProperties}
                    whileHover={prefersReduced ? {} : {
                      y: -8,
                      transition: { duration: 0.22, ease: "easeOut" },
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={`${mansalva.className} svc-pill`}>
                        {item.shortLabel}
                      </span>
                      <span className={`${epilogue.className} svc-num`}>
                        {padNum}
                      </span>
                    </div>

                    <h2 className={`${epilogue.className} mt-5 text-[26px] font-extrabold leading-[1.06] tracking-[-0.04em] text-[#0e2547] lg:text-[30px]`}>
                      {item.title}
                    </h2>

                    <p className={`${outfit.className} mt-3 text-[15px] leading-[1.8] text-slate-500`}>
                      {item.description}
                    </p>

                    <p className={`${outfit.className} mt-3 text-[14px] leading-[1.75] text-slate-400`}>
                      {item.intro.slice(0, 150)}…
                    </p>

                    <div className="svc-divider" />

                    <p className={`${epilogue.className} mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400`}>
                      Includes
                    </p>

                    <ul className="space-y-2">
                      {item.points.slice(0, 4).map((point) => (
                        <li
                          key={point}
                          className={`${outfit.className} flex items-start gap-3 text-[14px] leading-[1.7] text-slate-500`}
                        >
                          <span className="svc-dot" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex-1" />

                    <LocalizedClientLink
                      href={`/services/${item.slug}`}
                      className={`${epilogue.className} svc-cta`}
                    >
                      <span className="cta-label">Learn More</span>
                      <span className="cta-arrow">→</span>
                    </LocalizedClientLink>

                  </MotionArticle>
                </Reveal>
              )
            })}
          </div>

        </div>
      </div>
    </main>
  )
}