"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Epilogue, Mansalva, Outfit } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500"] })

const words = ["faster,", "predictable,", "profitable"]

// ── SVG Scribble Icons ──────────────────────────────────────────────────────

/**
 * Crown — stroke-only (no fill), purple to match the hero blob gradient.
 * Gems are small open circles, also unfilled.
 */
const CrownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* main crown shape — outline only */}
    <path
      d="M6 48 L18 16 L34 32 L40 8 L46 32 L62 16 L74 48 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* base band — outline only */}
    <rect x="6" y="49" width="68" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
    {/* gem circles — open, no fill */}
    <circle cx="40" cy="8"  r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="18" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="62" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

/** 4-point sparkle — top right accent */
const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 4 C32 4 34 22 48 28 C34 34 32 52 32 52 C32 52 30 34 16 28 C30 22 32 4 32 4Z"
      fill="currentColor"
    />
    <path
      d="M56 12 C56 12 57.5 20 63 22.5 C57.5 25 56 33 56 33 C56 33 54.5 25 49 22.5 C54.5 20 56 12 56 12Z"
      fill="currentColor"
      opacity="0.6"
    />
  </svg>
)

/** Squiggly upward arrow — left mid, implies momentum */
const SquiggleArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 48 C16 48 16 20 28 20 C40 20 40 44 52 44 C60 44 64 36 68 28"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M60 18 L68 28 L76 18"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

/** Rising bars — bottom right, signals growth/performance */
const BarsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4"  y="44" width="12" height="16" rx="3" fill="currentColor" opacity="0.45" />
    <rect x="20" y="32" width="12" height="28" rx="3" fill="currentColor" opacity="0.65" />
    <rect x="36" y="20" width="12" height="40" rx="3" fill="currentColor" opacity="0.85" />
    <rect x="52" y="8"  width="12" height="52" rx="3" fill="currentColor" />
    <circle cx="58" cy="5" r="3" fill="currentColor" opacity="0.5" />
  </svg>
)

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState(words[0])
  const [isDeleting, setIsDeleting] = useState(false)

  const currentWord = useMemo(() => words[wordIndex], [wordIndex])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayedText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 1200)
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % words.length)
    } else {
      timeout = setTimeout(
        () => {
          const nextText = isDeleting
            ? currentWord.slice(0, displayedText.length - 1)
            : currentWord.slice(0, displayedText.length + 1)
          setDisplayedText(nextText)
        },
        isDeleting ? 55 : 90
      )
    }

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, currentWord])

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-14 lg:pt-14 lg:pb-20">
      <style>{`
        /* ── Scribbles ── */
        .scribble {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .scribble:hover {
          transform: scale(1.15) rotate(8deg);
          opacity: 0.75;
        }

        /* ── Crown bob ── */
        @keyframes bob {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(-7px); }
        }
        .crown-bob {
          animation: bob 2.8s ease-in-out infinite;
        }
        .crown-bob:hover {
          animation: none;
          transform: translateX(-50%) scale(1.12) rotate(-5deg);
          cursor: default;
        }

        /* ── Get Started button ── */
        .btn-get-started {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          border-radius: 14px;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #fff;
          text-decoration: none;
          background: linear-gradient(135deg, #9333ea 0%, #c026d3 55%, #e11d78 100%);
          box-shadow: 0 4px 20px rgba(147, 51, 234, 0.35);
          transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
          overflow: hidden;
        }
        /* shimmer layer */
        .btn-get-started::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .btn-get-started:hover::before {
          transform: translateX(100%);
        }
        .btn-get-started:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 28px rgba(192, 38, 211, 0.45);
        }
        .btn-get-started:active {
          transform: translateY(0px) scale(0.99);
          box-shadow: 0 3px 12px rgba(147, 51, 234, 0.3);
        }
        /* animated arrow */
        .btn-get-started .arrow {
          display: inline-block;
          transition: transform 0.22s ease;
        }
        .btn-get-started:hover .arrow {
          transform: translateX(5px);
        }
      `}</style>

      <div className="content-container relative lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">

          {/* ── LEFT VISUAL ── */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[720px]">

              {/* background blobs */}
              <div className="absolute left-[8%] top-[14%] h-[74%] w-[78%] rounded-[28%] bg-slate-200/35" />
              <div
                className="absolute left-[13%] top-[18%] h-[68%] w-[72%] rounded-[24%]"
                style={{ background: "linear-gradient(135deg, #c026d3 0%, #9333ea 45%, #a855f7 100%)" }}
              />
              <div className="absolute left-[12%] top-[17%] h-[70%] w-[74%] rounded-[24%] border-[3px] border-[#d7d7e6]/70" />

              {/* Hero image */}
              <div className="relative z-10 flex justify-center pt-2">
                <Image
                  src="/hero-girl.png"
                  alt="Creative design hero"
                  width={700}
                  height={880}
                  priority
                  className="h-auto w-[95%] max-w-[620px] object-contain"
                />
              </div>

              {/*
                CROWN — outline only, purple (#9333ea) to echo the blob gradient.
                Centred with left-[50%] + translateX(-50%).
                top-[3%] floats it just above the head region of the square image.
              */}
              <div
                className="crown-bob absolute left-[50%] top-[3%] z-20 w-[72px] drop-shadow-md"
                style={{ color: "#9333ea", transform: "translateX(-50%)" }}
              >
                <CrownIcon />
              </div>

              {/* SPARKLE — top right, rose accent */}
              <div className="scribble absolute right-[8%] top-[12%] z-20 w-[50px] text-rose-400 drop-shadow">
                <SparkleIcon />
              </div>

              {/* SQUIGGLE ARROW — left mid, violet */}
              <div className="scribble absolute left-[0%] top-[48%] z-20 w-[66px] text-violet-400 drop-shadow">
                <SquiggleArrowIcon />
              </div>

              {/* RISING BARS — bottom right, sky */}
              <div className="scribble absolute right-[3%] bottom-[14%] z-20 w-[54px] text-sky-400 drop-shadow">
                <BarsIcon />
              </div>

            </div>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div className="max-w-[760px]">

            <p className={`${mansalva.className} mb-4 text-[22px] font-bold text-[#ef3a6b]`}>
              Growing a D2C brand is challenging
            </p>

            <h1 className={`${epilogue.className} text-[#0e2547] leading-[1.05]`}>
              <span className="block text-[52px] font-bold sm:text-[60px] lg:text-[76px] xl:text-[84px]">
                We make it{" "}
                <span className="inline-block w-[13ch]">
                  {displayedText}
                  <span className="ml-1 inline-block h-[0.9em] w-[3px] animate-pulse bg-[#0e2547]" />
                </span>
              </span>

              <span className="relative block text-[52px] font-bold sm:text-[60px] lg:text-[76px] xl:text-[84px]">
                and scalable
                <span className="absolute left-0 bottom-[6px] -z-10 h-[10px] w-[40%] bg-[#ef5b87]" />
              </span>
            </h1>

            <p className={`${outfit.className} mt-7 text-[16px] leading-[2] text-slate-500 lg:text-[18px]`}>
              We simplify growth for modern brands by combining strategy, design,
              and performance into a system that actually works. No random efforts,
              only structured growth.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-8">
              <Link href="/contact" className={`${epilogue.className} btn-get-started`}>
                Get Started
                <span className="arrow">→</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}