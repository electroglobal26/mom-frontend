"use client"

/*
  ┌──────────────────────────────────────────────────────────────────┐
  │  BLOG PAGE — EDITORIAL LAYOUT                                    │
  │                                                                  │
  │  Structure (different from plain 3-col cards):                  │
  │                                                                  │
  │  ┌─────────────── HEADING ────────────────┐                     │
  │  │ Blog eyebrow + large title + body      │                     │
  │  └────────────────────────────────────────┘                     │
  │                                                                  │
  │  ┌─────────── FEATURED POST (full width) ─────────────┐        │
  │  │  Large image (16:9) + overlay gradient              │        │
  │  │  Category pill · Date                               │        │
  │  │  BIG title on dark overlay                          │        │
  │  │  Excerpt                          [Read Article →]  │        │
  │  └─────────────────────────────────────────────────────┘        │
  │                                                                  │
  │  ┌──── REMAINING POSTS — horizontal list cards ────────┐        │
  │  │  [img]  Category · Date                              │        │
  │  │         Title                                        │        │
  │  │         Excerpt                   Read Article →     │        │
  │  │  ─────────────────────────────────────────────────  │        │
  │  │  [img]  Category · Date                              │        │
  │  └──────────────────────────────────────────────────────┘        │
  │                                                                  │
  │  Motion:                                                         │
  │  - Heading: stagger fade-up on mount                            │
  │  - Featured: fade-up on scroll (Reveal)                         │
  │  - Featured image: scale on hover (CSS group)                   │
  │  - List cards: stagger Reveal, hover lift via Motion            │
  │  - "Read Article" arrow slides right on hover (CSS)             │
  │  - Underline: scaleX Motion whileInView                         │
  └──────────────────────────────────────────────────────────────────┘
*/

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { blogPosts } from "@lib/data/blog-posts"
import { Epilogue, Outfit, Mansalva } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit   = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

// ── Scroll state machine ──────────────────────────────────────────────────────

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
  children, delay = 0, offset = 32, amount = 0.15, className = "",
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

const MotionLocalLink = motion.create(LocalizedClientLink)

// ── Component ─────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const prefersReduced = useReducedMotion()

  // Split posts: first is featured hero, rest are list cards
  const [featured, ...rest] = blogPosts
  const listPosts = rest.slice(0, 5) // cap at 5 more

  const [hoveredList, setHoveredList] = useState<number | null>(null)

  return (
    <main className="relative overflow-hidden bg-[#f3f4f6] pt-14 pb-20 lg:pt-18 lg:pb-24">
      <style>{`
        /* ── Featured card ── */
        .blog-featured {
          border-radius: 24px;
          overflow: hidden;
          background: #0e2547;
        }
        /* Target the next/image generated img tag */
        .blog-featured .blog-featured-img {
          transition: transform 0.7s ease !important;
        }
        .blog-featured:hover .blog-featured-img {
          transform: scale(1.04) !important;
        }

        /* Category pill */
        .blog-pill {
          display: inline-flex;
          align-items: center;
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          background: rgba(230, 30, 115, 0.18);
          color: #ff6eb0;
          border: 1px solid rgba(230, 30, 115, 0.35);
          backdrop-filter: blur(4px);
        }

        /* ── List post cards ── */
        .blog-list-card {
          position: relative;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          background: #fff;
          border-radius: 18px;
          padding: 20px;
          border: 1.5px solid #ebebeb;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          text-decoration: none;
          cursor: pointer;
        }
        .blog-list-card.is-hovered {
          border-color: #e61e73;
          box-shadow: 0 16px 48px rgba(0,0,0,0.10);
        }
        /* Left accent bar */
        .blog-list-card::before {
          content: "";
          position: absolute;
          left: 0; top: 14px; bottom: 14px;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: #e61e73;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .blog-list-card.is-hovered::before { opacity: 1; }

        /* Image inside list card */
        .blog-list-img-wrap {
          flex-shrink: 0;
          width: 120px;
          height: 100px;
          border-radius: 12px;
          overflow: hidden;
          background: #f0f0f0;
          position: relative;
        }
        @media (min-width: 640px) {
          .blog-list-img-wrap { width: 160px; height: 120px; }
        }
        .blog-list-img-wrap img {
          transition: transform 0.5s ease !important;
        }
        .blog-list-card.is-hovered .blog-list-img-wrap img {
          transform: scale(1.06) !important;
        }

        /* Read link */
        .blog-read-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #e61e73;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .blog-read-link:hover { opacity: 0.7; }
        .blog-read-link .read-arrow {
          display: inline-block;
          transition: transform 0.2s ease;
        }
        .blog-read-link:hover .read-arrow { transform: translateX(4px); }

        /* ── Featured read CTA ── */
        .featured-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #0e2547;
          text-decoration: none;
          background: #fff;
          overflow: hidden;
          transition: color 0.25s ease, box-shadow 0.25s ease, transform 0.22s ease;
        }
        .featured-cta::before {
          content: "";
          position: absolute; inset: 0;
          background: #e61e73;
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
          z-index: 0;
        }
        .featured-cta:hover::before { transform: translateX(0); }
        .featured-cta:hover { color: #fff; box-shadow: 0 6px 20px rgba(230,30,115,0.35); transform: translateY(-2px); }
        .featured-cta .cta-label, .featured-cta .cta-arrow { position: relative; z-index: 1; }
        .featured-cta .cta-arrow { display: inline-block; transition: transform 0.22s ease; }
        .featured-cta:hover .cta-arrow { transform: translateX(4px); }
      `}</style>

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-[8%] h-[130px] w-[400px] rounded-full bg-white/45 blur-3xl" />
        <div className="absolute right-[6%] top-[10%] h-[140px] w-[340px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[18%] bottom-[8%] h-[100px] w-[400px] rounded-full bg-white/35 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          {/* ══════════════════════════════════════════
              HEADING
          ══════════════════════════════════════════ */}
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-12">

            {/* Left — title */}
            <div>
              <motion.p
                className={`${mansalva.className} mb-3 text-[22px] font-bold leading-none text-[#e61e73]`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              >
                Blog
              </motion.p>

              <motion.h1
                className={`${epilogue.className} text-[40px] font-extrabold leading-[0.95] tracking-[-0.065em] text-[#0e2547] sm:text-[54px] lg:text-[72px]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <span className="relative inline-block">
                  News &amp; insights
                  {/* Underline — scaleX from left on mount */}
                  <motion.span
                    className="absolute bottom-[5px] left-0 -z-10 h-[13px] w-full rounded-[2px] bg-[#ef6a99]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
                    style={{ transformOrigin: "left center" }}
                  />
                </span>
              </motion.h1>
            </div>

            {/* Right — subtitle aligned to baseline of title */}
            <motion.p
              className={`${outfit.className} max-w-[420px] text-[15px] leading-[1.85] text-slate-500 lg:pb-2 lg:text-[16px]`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              Thoughts, strategy, and practical insights on creative systems,
              performance content, and brand growth.
            </motion.p>
          </div>

          {/* ══════════════════════════════════════════
              FEATURED POST — large hero card
          ══════════════════════════════════════════ */}
          {featured && (
            <Reveal delay={0.1} offset={40} amount={0.15} className="mt-12">
              <div className="blog-featured group overflow-hidden rounded-[24px]">

                {/*
                  IMAGE FIX: next/image with fill needs the parent to have
                  position:relative + a defined height. Using paddingBottom %
                  is the most reliable cross-browser way to enforce aspect ratio
                  when the parent has position:relative and the child is fill.
                  aspect-ratio CSS alone doesn't work reliably with fill in Next.js.
                */}
                <div className="relative w-full" style={{ paddingBottom: "43.75%" /* 16:7 ratio = 7/16 = 0.4375 */ }}>
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="blog-featured-img object-cover"
                    priority
                  />

                  {/* dark gradient overlay */}
                  <div
                    className="absolute inset-0 z-10"
                    style={{
                      background: "linear-gradient(to top, rgba(10,20,50,0.94) 0%, rgba(10,20,50,0.6) 40%, rgba(10,20,50,0.1) 100%)",
                    }}
                  />

                  {/* Pink bars doodle — top right */}
                  <div className="pointer-events-none absolute right-8 top-0 z-20 opacity-80">
                    <svg width="68" height="46" viewBox="0 0 82 54" fill="none">
                      <path
                        d="M8 44C14 20 14 8 14 2M24 46C30 24 30 11 30 4M40 48C46 26 46 13 46 6M56 48C62 28 62 16 62 10M72 46C76 30 76 20 76 14"
                        stroke="#e61e73" strokeWidth="4" strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Content overlay — sits on z-20 above gradient */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 lg:p-12">
                    {/* Pill + date */}
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className={`${mansalva.className} blog-pill`}>
                        {featured.category}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-white/40" />
                      <span className={`${outfit.className} text-[13px] font-semibold uppercase tracking-[0.05em] text-white/60`}>
                        {featured.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className={`${epilogue.className} max-w-[820px] text-[28px] font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-[36px] lg:text-[50px]`}>
                      {featured.title}
                    </h2>

                    {/* Excerpt + CTA */}
                    <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                      <p className={`${outfit.className} max-w-[580px] text-[14px] leading-[1.8] text-white/65 lg:text-[15px]`}>
                        {featured.excerpt}
                      </p>
                      <LocalizedClientLink href={`/blog/${featured.slug}`} className="featured-cta flex-shrink-0">
                        <span className="cta-label">Read Article</span>
                        <span className="cta-arrow">→</span>
                      </LocalizedClientLink>
                    </div>
                  </div>
                </div>

              </div>
            </Reveal>
          )}

          {/* ══════════════════════════════════════════
              LIST POSTS — horizontal cards
          ══════════════════════════════════════════ */}
          {listPosts.length > 0 && (
            <div className="mt-10">

              {/* Section label */}
              <Reveal offset={16} amount={0.4}>
                <div className="mb-6 flex items-center gap-4">
                  <p className={`${epilogue.className} text-[13px] font-bold uppercase tracking-[0.08em] text-slate-400`}>
                    More articles
                  </p>
                  <div className="flex-1 h-[1px] bg-slate-200" />
                </div>
              </Reveal>

              {/* Two-column list at lg */}
              <div className="grid gap-4 lg:grid-cols-2">
                {listPosts.map((post, idx) => {
                  const isHov = hoveredList === idx
                  return (
                    <Reveal key={post.slug} delay={idx * 0.07} offset={28} amount={0.12}>
                      <motion.div
                        className={`blog-list-card${isHov ? " is-hovered" : ""}`}
                        whileHover={prefersReduced ? {} : {
                          y: -4,
                          transition: { duration: 0.2, ease: "easeOut" },
                        }}
                        onMouseEnter={() => setHoveredList(idx)}
                        onMouseLeave={() => setHoveredList(null)}
                      >
                        {/* Thumbnail — use width/height not fill for small fixed-size images */}
                        <div className="blog-list-img-wrap flex-shrink-0">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="160px"
                            className="object-cover"
                          />
                        </div>

                        {/* Text */}
                        <div className="flex min-w-0 flex-1 flex-col gap-2">

                          {/* Category + date */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`${mansalva.className} text-[15px] font-bold text-[#e61e73]`}>
                              {post.category}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span className={`${outfit.className} text-[12px] font-semibold uppercase tracking-[0.04em] text-slate-400`}>
                              {post.date}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className={`${epilogue.className} text-[17px] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#0e2547] lg:text-[19px]`}
                            style={{ color: isHov ? "#e61e73" : "#0e2547", transition: "color 0.2s ease" }}
                          >
                            {post.title}
                          </h2>

                          {/* Excerpt — truncated */}
                          <p className={`${outfit.className} line-clamp-2 text-[13px] leading-[1.75] text-slate-400`}>
                            {post.excerpt}
                          </p>

                          {/* Read link */}
                          <LocalizedClientLink
                            href={`/blog/${post.slug}`}
                            className={`${epilogue.className} blog-read-link mt-1`}
                          >
                            Read Article
                            <span className="read-arrow">→</span>
                          </LocalizedClientLink>
                        </div>
                      </motion.div>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}