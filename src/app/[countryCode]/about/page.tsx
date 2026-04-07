"use client"

/*
  ┌──────────────────────────────────────────────────────────────────┐
  │  ABOUT PAGE — KEY FIXES                                          │
  │                                                                  │
  │  IMAGE FIX:                                                      │
  │  Original used a 320×320 div inside a 520px container.          │
  │  The blob shapes were centred on the container but the image    │
  │  was too small relative to them → looked misaligned.            │
  │  Fix: image fills the container properly using a taller         │
  │  aspect ratio, blobs scaled to match, grid aligned to center.   │
  │                                                                  │
  │  EMOJI SCRIBBLES → SVG ICONS:                                   │
  │  ♕ → CrownIcon (outline, purple — matches blob gradient)       │
  │  ✦ → SparkleIcon (4-point star, green-400)                     │
  │  ⌒ → WaveIcon (wave paths, violet)                             │
  │  ≋ → BarsIcon (rising bars, sky)                               │
  │                                                                  │
  │  MOTION — inlined state machine (same as other components):     │
  │  - useScrollState hook → idle / visible / resting               │
  │  - Reveal wrapper → re-animates on scroll-in, no blank on up   │
  │  - Hero: motion.div on text blocks stagger on mount             │
  │  - Founder section: card + photo fade in                        │
  │  - Values cards: stagger reveal                                 │
  │  - Doodles: stagger float-in                                    │
  │  - Final CTA: fade up                                           │
  └──────────────────────────────────────────────────────────────────┘
*/

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import StatsStrip from "@modules/home/components/stats-strip"
import CaseStudies from "@modules/home/components/case-studies"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Epilogue, Outfit, Mansalva } from "next/font/google"

const epilogue  = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit    = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva  = Mansalva({ subsets: ["latin"], weight: ["400"] })

// ── Scroll state machine (inlined — no external file) ─────────────────────────

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
          // resting = was seen, stays fully visible. Never goes back to idle.
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
  children: React.ReactNode; delay?: number; offset?: number; amount?: number; className?: string
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

// ── SVG Doodles ───────────────────────────────────────────────────────────────

/** Crown — outline only, purple, sits above the image */
const CrownIcon = () => (
  <svg width="72" height="50" viewBox="0 0 80 56" fill="none">
    <path d="M6 48 L18 16 L34 32 L40 8 L46 32 L62 16 L74 48 Z"
      fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="6" y="49" width="68" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="40" cy="8"  r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="18" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="62" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

/** 4-point sparkle */
const SparkleIcon = () => (
  <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
    <path d="M32 4 C32 4 34 22 48 28 C34 34 32 52 32 52 C32 52 30 34 16 28 C30 22 32 4 32 4Z" fill="currentColor" />
    <path d="M56 12 C56 12 57.5 20 63 22.5 C57.5 25 56 33 56 33 C56 33 54.5 25 49 22.5 C54.5 20 56 12 56 12Z" fill="currentColor" opacity="0.55" />
  </svg>
)

/** Wave lines */
const WaveIcon = () => (
  <svg width="62" height="44" viewBox="0 0 64 48" fill="none">
    <path d="M4 12 C10 4 18 4 24 12 C30 20 38 20 44 12 C50 4 58 4 62 10"
      stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M4 28 C10 20 18 20 24 28 C30 36 38 36 44 28 C50 20 58 20 62 26"
      stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.55" />
    <path d="M4 42 C10 34 18 34 24 42 C30 50 38 50 44 42 C50 34 58 34 62 40"
      stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.28" />
  </svg>
)

/** Rising bars */
const BarsIcon = () => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <rect x="4"  y="44" width="12" height="16" rx="3" fill="currentColor" opacity="0.4" />
    <rect x="20" y="32" width="12" height="28" rx="3" fill="currentColor" opacity="0.6" />
    <rect x="36" y="20" width="12" height="40" rx="3" fill="currentColor" opacity="0.8" />
    <rect x="52" y="8"  width="12" height="52" rx="3" fill="currentColor" />
  </svg>
)

// ── Doodle config — positions relative to the right image column ──────────────
/*
  Image column is max-w-[520px], image itself fills it properly.
  Blobs are centred at 50% 50% of the column.
  Person image renders at roughly 400×500 (portrait).
  Head is in top-centre of image.

  Crown: horizontally centred, sits above head → left-[50%] -translate-x-1/2, top-[2%]
  Sparkle: top-right corner of blob area
  Wave: left-mid, beside the image
  Bars: bottom-right
*/

// ── Values cards data ─────────────────────────────────────────────────────────

const values = [
  {
    num: "01",
    title: "Strategy before content",
    text: "We don't create content for the sake of activity. Every piece should support positioning, demand, and conversion.",
    accent: "#61baf7",
  },
  {
    num: "02",
    title: "Creative that converts",
    text: "Strong aesthetics matter, but performance matters more. We build creative that feels premium and still moves results.",
    accent: "#a855f7",
  },
  {
    num: "03",
    title: "Consistency compounds",
    text: "Real growth rarely comes from one lucky campaign. It comes from systems, repeated execution, and clear direction.",
    accent: "#49d7a4",
  },
]

// ── MotionLink wrapper ────────────────────────────────────────────────────────

const MotionLocalLink = motion.create(LocalizedClientLink)

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  // countryCode needed for CaseStudies — unwrap with use() or pass as prop
  // Since this is async, we handle params properly below
  const [countryCode, setCountryCode] = useState("us")

  useEffect(() => {
    props.params.then(({ countryCode }) => setCountryCode(countryCode))
  }, [props.params])

  const prefersReduced = useReducedMotion()

  // Doodle scroll state — drives the 4 hero doodles
  const doodleContainerRef = useRef<HTMLDivElement>(null)
  const [doodleState, setDoodleState] = useState<ScrollState>("idle")

  useEffect(() => {
    const el = doodleContainerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setDoodleState("visible")
        else setDoodleState((prev) => (prev === "idle" ? "idle" : "resting"))
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="bg-[#f3f4f6]">

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-20 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[6%] top-[10%] h-[140px] w-[420px] rounded-full bg-[#f4f4f6] blur-3xl" />
          <div className="absolute right-[8%] top-[18%] h-[160px] w-[360px] rounded-full bg-[#f6f6f8] blur-3xl" />
          <div className="absolute left-[20%] bottom-[6%] h-[120px] w-[420px] rounded-full bg-[#f5f5f7] blur-3xl" />
        </div>

        <div className="content-container relative px-4 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1fr_480px]">

            {/* ── LEFT — text ── */}
            <div>
              {/* Eyebrow */}
              <motion.p
                className={`${mansalva.className} mb-5 text-[24px] font-bold leading-none text-[#e61e73] sm:text-[28px]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              >
                ABOUT US
              </motion.p>

              {/* H1 */}
              <motion.h1
                className={`${epilogue.className} max-w-[820px] text-[44px] font-extrabold leading-[0.95] tracking-[-0.06em] text-[#0e2547] sm:text-[58px] lg:text-[72px]`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <span className="relative inline-block">
                  We help brands grow
                  {/* Underline — animates width on mount */}
                  <motion.span
                    className="absolute bottom-[8px] left-0 -z-10 h-[14px] bg-[#ef6a99]"
                    initial={{ width: "0%" }}
                    animate={{ width: "64%" }}
                    transition={{ duration: 0.65, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  />
                </span>
                <br />
                with strategy, content,
                <br />
                and performance-led creative.
              </motion.h1>

              {/* Body */}
              <motion.p
                className={`${outfit.className} mt-8 max-w-[760px] text-[17px] leading-9 text-slate-500 lg:text-[18px]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              >
                Momentum is a creative and performance-focused agency helping D2C brands,
                startups, and modern businesses scale through storytelling, ad creatives,
                and conversion-led systems. We care about work that not only looks strong,
                but also drives real business movement.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                className="mt-10 flex flex-wrap items-center gap-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
              >
                <style>{`
                  .btn-primary {
                    display:inline-flex; height:58px; align-items:center; justify-content:center;
                    border-radius:16px; background:#0e2547; padding:0 32px;
                    font-size:15px; font-weight:800; letter-spacing:0.02em;
                    text-transform:uppercase; color:#fff; text-decoration:none;
                    transition:transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
                  }
                  .btn-primary:hover { background:#1a3a6b; transform:translateY(-2px); box-shadow:0 8px 24px rgba(14,37,71,0.25); }
                  .btn-primary:active { transform:translateY(0); }

                  .btn-oval {
                    position:relative; display:inline-flex; height:58px; align-items:center;
                    justify-content:center; padding:0 8px; font-size:15px; font-weight:800;
                    letter-spacing:0.02em; text-transform:uppercase; color:#0e2547;
                    text-decoration:none;
                  }
                  .btn-oval .oval-ring {
                    position:absolute; left:50%; top:50%;
                    transform:translate(-50%,-50%);
                    width:118px; height:46px; border-radius:999px;
                    border:4px solid #4ad79f;
                    transition:width 0.25s ease, height 0.25s ease, opacity 0.25s ease;
                  }
                  .btn-oval:hover .oval-ring { width:134px; height:54px; opacity:0.7; }
                  .btn-oval span.label { position:relative; z-index:1; }
                `}</style>

                <LocalizedClientLink href="/work" className="btn-primary">
                  See Our Work
                  <span className="ml-3 text-[22px] leading-none">›</span>
                </LocalizedClientLink>

                <LocalizedClientLink href="/contact" className="btn-oval">
                  <span className="label">Let&apos;s Talk</span>
                  <span className="oval-ring" />
                </LocalizedClientLink>
              </motion.div>
            </div>

            {/* ── RIGHT — image clipped inside purple shape + doodles outside ── */}
            {/*
              KEY FIX:
              The image must be INSIDE the rounded purple shape with overflow:hidden
              so it gets clipped by the border-radius — exactly like the screenshot shows.

              Structure:
              ┌─ outer wrapper (relative, no overflow) ─────────────────┐
              │  ┌─ purple shape (overflow:hidden, clips the image) ──┐  │
              │  │   Image sits here — clipped by rounded corners     │  │
              │  └────────────────────────────────────────────────────┘  │
              │  doodles positioned absolute outside the clipped shape   │
              └──────────────────────────────────────────────────────────┘

              The outer wrapper has padding to give doodles room to overflow.
              This matches the original design intent from the screenshot.
            */}
            <div ref={doodleContainerRef} className="relative mx-auto w-full max-w-[460px]" style={{ padding: "32px 24px 24px" }}>

              {/*
                PURPLE ROUNDED SHAPE — overflow:hidden clips the image inside it.
                This is the critical fix. Previously the image was a sibling of the
                shape, sitting on top via z-index. Now it's a child, clipped by it.
              */}
              <div
                className="relative w-full overflow-hidden"
                style={{
                  borderRadius: "28%",
                  aspectRatio: "1 / 1.08",
                  background: "linear-gradient(135deg, #c026d3 0%, #9333ea 50%, #a855f7 100%)",
                  boxShadow: "0 24px 80px rgba(147,51,234,0.30)",
                }}
              >
                {/* Subtle grey back shape visible through transparent image areas */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: "radial-gradient(ellipse at 50% 120%, #fff 0%, transparent 70%)" }}
                />

                {/* Image — fill inside the clipped rounded shape */}
                <Image
                  src="/about/about-hero.png"
                  alt="About Momentum"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Outline ring — sits on top of the shape, outside the clip */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  margin: "32px 24px 24px",
                  borderRadius: "28%",
                  border: "3px solid rgba(215,215,230,0.65)",
                }}
              />

              {/*
                DOODLES — all outside the clipped shape, positioned relative to outer wrapper.
                No SVG icon components — just the simple emoji-free Motion divs.

                Crown: centred at top, above the shape → top:0, left:50%, translateX(-50%)
                Sparkle: top-right corner, outside the shape
                Wave: left side, mid-height
                Bars: right side, lower area
              */}

              {/* CROWN — centred above the shape, bobs */}
              <motion.div
                className="absolute left-1/2 top-0 z-10 text-[#9333ea]"
                style={{ translateX: "-50%" }}
                animate={
                  doodleState === "visible"
                    ? { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const } }
                    : doodleState === "resting"
                    ? { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } }
                    : { opacity: 0, y: -16, scale: 0.7, transition: { duration: 0 } }
                }
              >
                <motion.div
                  animate={doodleState !== "idle" && !prefersReduced ? { y: [0, -6, 0] } : {}}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CrownIcon />
                </motion.div>
              </motion.div>

              {/* SPARKLE — top-right, outside shape */}
              <motion.div
                className="absolute right-0 top-[18%] z-10 text-green-400"
                animate={
                  doodleState === "visible"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, delay: 0.32, ease: [0.16, 1, 0.3, 1] as const } }
                    : doodleState === "resting"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0 } }
                    : { opacity: 0, x: 14, scale: 0.7, transition: { duration: 0 } }
                }
                whileHover={prefersReduced ? {} : { scale: 1.2, rotate: 15, transition: { duration: 0.2 } }}
              >
                <SparkleIcon />
              </motion.div>

              {/* WAVE — left side, mid */}
              <motion.div
                className="absolute left-0 top-[44%] z-10 text-violet-400"
                animate={
                  doodleState === "visible"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, delay: 0.44, ease: [0.16, 1, 0.3, 1] as const } }
                    : doodleState === "resting"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0 } }
                    : { opacity: 0, x: -14, scale: 0.8, transition: { duration: 0 } }
                }
                whileHover={prefersReduced ? {} : { scale: 1.12, rotate: 8, transition: { duration: 0.2 } }}
              >
                <WaveIcon />
              </motion.div>

              {/* BARS — right side, lower */}
              <motion.div
                className="absolute right-0 bottom-[18%] z-10 text-sky-400"
                animate={
                  doodleState === "visible"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, delay: 0.56, ease: [0.16, 1, 0.3, 1] as const } }
                    : doodleState === "resting"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0 } }
                    : { opacity: 0, x: 14, scale: 0.7, transition: { duration: 0 } }
                }
                whileHover={prefersReduced ? {} : { scale: 1.12, rotate: -8, transition: { duration: 0.2 } }}
              >
                <BarsIcon />
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOUNDER / STORY
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f3f4f6] py-16 lg:py-20">
        <div className="content-container px-4 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[400px_1fr] lg:items-start">

            {/* Photo card */}
            <Reveal offset={40} amount={0.2}>
              <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_22px_55px_rgba(0,0,0,0.08)]">
                <div className="relative aspect-[4/5] w-full bg-[#eef0f2]">
                  <Image src="/about/kuldeep.jpg" alt="Kuldeep Ahir" fill className="object-cover" />
                </div>
                {/* Name below photo */}
                <div className="px-6 py-5">
                  <p className={`${epilogue.className} text-[18px] font-extrabold tracking-[-0.03em] text-[#0e2547]`}>Kuldeep Ahir</p>
                  <p className={`${outfit.className} mt-1 text-[14px] font-medium text-[#e61e73]`}>Founder & Creative Director</p>
                </div>
              </div>
            </Reveal>

            {/* Story card */}
            <Reveal delay={0.12} offset={40} amount={0.15}>
              <div className="rounded-[24px] bg-white p-8 shadow-[0_22px_55px_rgba(0,0,0,0.08)] lg:p-12">
                <p className={`${mansalva.className} text-[22px] font-bold leading-none text-[#ef3a6b]`}>
                  Founder story
                </p>

                <h2 className={`${epilogue.className} mt-4 text-[34px] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#0e2547] lg:text-[48px]`}>
                  The team behind your growth
                </h2>

                {/* Accent divider */}
                <div className="mt-6 h-[4px] w-[60px] rounded-full bg-[#e61e73]" />

                <p className={`${outfit.className} mt-6 max-w-[820px] text-[17px] leading-9 text-slate-500 lg:text-[18px]`}>
                  Momentum is built around one clear belief: brands grow faster when
                  creative, performance, and execution are aligned. Instead of treating
                  content, ads, and strategy as separate things, we build systems where
                  each piece supports the other.
                </p>

                <p className={`${outfit.className} mt-5 max-w-[820px] text-[17px] leading-9 text-slate-500 lg:text-[18px]`}>
                  From D2C brands to local businesses and product-led companies, our work
                  focuses on helping brands look sharper, communicate better, and convert
                  more consistently. We are not here just to make content. We are here to
                  build momentum.
                </p>

                {/* Signature-style quote */}
                <div className="mt-8 rounded-[14px] border-l-[4px] border-[#9333ea] bg-[#f5eeff] px-6 py-4">
                  <p className={`${outfit.className} text-[16px] leading-8 text-[#4c1d95]`}>
                    &ldquo;We are not here just to make content. We are here to build momentum.&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          VALUES
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[15%] h-[120px] w-[300px] rounded-full bg-[#f5f5f7] blur-3xl" />
          <div className="absolute right-[10%] bottom-[12%] h-[140px] w-[340px] rounded-full bg-[#f6f6f8] blur-3xl" />
        </div>

        <div className="content-container relative px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1320px]">

            <Reveal offset={28} amount={0.3}>
              <div className="max-w-[760px]">
                <p className={`${mansalva.className} mb-4 text-[22px] font-bold text-[#ef3a6b]`}>
                  What we believe
                </p>
                <h2 className={`${epilogue.className} text-[34px] font-extrabold leading-[1] tracking-[-0.055em] text-[#0e2547] lg:text-[56px]`}>
                  Growth comes from clarity, consistency, and creative systems.
                </h2>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {values.map((v, i) => (
                <Reveal key={v.num} delay={i * 0.1} offset={32} amount={0.2}>
                  <motion.div
                    className="h-full rounded-[22px] bg-[#f3f4f6] p-7"
                    style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.04)" }}
                    whileHover={prefersReduced ? {} : {
                      y: -6,
                      boxShadow: "0 20px 44px rgba(0,0,0,0.08)",
                      transition: { duration: 0.22 },
                    }}
                  >
                    <div
                      className={`${epilogue.className} text-[34px] font-extrabold`}
                      style={{ color: v.accent }}
                    >
                      {v.num}
                    </div>
                    <h3 className={`${epilogue.className} mt-4 text-[24px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#0e2547]`}>
                      {v.title}
                    </h3>
                    <p className={`${outfit.className} mt-4 text-[16px] leading-8 text-slate-500`}>
                      {v.text}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS + CASE STUDIES (existing components)
      ═══════════════════════════════════════════════════════ */}
      <StatsStrip />
      <CaseStudies countryCode={countryCode} />

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0e2547] py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[18%] h-[140px] w-[420px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          {/* subtle grid overlay for depth */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <div className="content-container relative px-4 sm:px-6 lg:px-10">
          <Reveal offset={32} amount={0.4}>
            <div className="mx-auto max-w-[920px] text-center">
              <p className={`${mansalva.className} mb-4 text-[22px] font-bold text-[#ef6a99]`}>
                Let&apos;s build together
              </p>

              <h2 className={`${epilogue.className} text-[38px] font-extrabold leading-[1] tracking-[-0.055em] text-white lg:text-[62px]`}>
                Let&apos;s build your growth system
              </h2>

              <p className={`${outfit.className} mx-auto mt-6 max-w-[760px] text-[17px] leading-9 text-white/75 lg:text-[18px]`}>
                Creative, strategy, and performance should work together. That is where real growth starts.
              </p>

              <div className="mt-9">
                <style>{`
                  .btn-cta {
                    display:inline-flex; height:58px; align-items:center; justify-content:center;
                    border-radius:16px; background:#ef3a6b; padding:0 36px;
                    font-size:15px; font-weight:800; letter-spacing:0.02em;
                    text-transform:uppercase; color:#fff; text-decoration:none;
                    transition:background 0.2s ease, transform 0.22s ease, box-shadow 0.22s ease;
                  }
                  .btn-cta:hover { background:#d92d5d; transform:translateY(-2px); box-shadow:0 8px 28px rgba(239,58,107,0.4); }
                  .btn-cta:active { transform:translateY(0); }
                `}</style>
                <LocalizedClientLink href="/contact" className="btn-cta">
                  Let&apos;s Talk
                  <span className="ml-3 text-[22px] leading-none">›</span>
                </LocalizedClientLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  )
}