"use client"

// FIX: All viewport.once changed to true — prevents blank-on-scroll-up
// FIX: Skill card hover via useState — reliable, no DOM setAttribute

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { Code2, PenTool, ShoppingCart, Cog, Eye, GitBranch, MessageSquare, Search } from "lucide-react"
import { Epilogue, Outfit } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit   = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })

const skills = [
  { title: "SEO/SEM/PPC",    Icon: Search,       color: "#61baf7", bg: "#e8f6ff", bgHover: "#c8e8f8", border: "#99dcf8" },
  { title: "Web Design",     Icon: PenTool,      color: "#a855f7", bg: "#f5eeff", bgHover: "#e9d5ff", border: "#d8b4fe" },
  { title: "Development",    Icon: Code2,        color: "#49d7a4", bg: "#e8fdf5", bgHover: "#bbf7d0", border: "#6ee7b7" },
  { title: "E-commerce",     Icon: ShoppingCart, color: "#f43f8e", bg: "#fff0f7", bgHover: "#fce7f3", border: "#fbcfe8" },
  { title: "Prototyping",    Icon: Cog,          color: "#f59e0b", bg: "#fffbeb", bgHover: "#fef9c3", border: "#fde68a" },
  { title: "Visual Design",  Icon: Eye,          color: "#61baf7", bg: "#e8f6ff", bgHover: "#c8e8f8", border: "#99dcf8" },
  { title: "Wireframing",    Icon: GitBranch,    color: "#a855f7", bg: "#f5eeff", bgHover: "#e9d5ff", border: "#d8b4fe" },
  { title: "User Research",  Icon: MessageSquare,color: "#49d7a4", bg: "#e8fdf5", bgHover: "#bbf7d0", border: "#6ee7b7" },
]

const CupIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 72" fill="none">
    <line x1="38" y1="4" x2="30" y2="20" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M14 20 Q14 14 32 14 Q50 14 50 20 L50 24 Q50 28 32 28 Q14 28 14 24 Z" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round" />
    <path d="M16 28 L20 66 Q20 70 32 70 Q44 70 44 66 L48 28 Z" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round" />
    <circle cx="24" cy="52" r="3.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <circle cx="32" cy="58" r="3.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <circle cx="40" cy="52" r="3.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
  </svg>
)
const GoalsText = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 130 52" fill="none">
    <text x="4" y="42" fontFamily="'Epilogue','Arial Black',sans-serif" fontWeight="800" fontSize="40" fill="#f43f8e" letterSpacing="-1">GOALS</text>
  </svg>
)
const ChunkyArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none">
    <path d="M10 10 L58 58 M38 58 L58 58 L58 38" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const BrushSquiggleBlue = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 40" fill="none">
    <path d="M4 28 C14 8 26 36 38 20 C48 6 58 32 72 18 C82 8 90 24 96 16" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M10 34 C22 18 34 38 48 26 C60 14 72 34 88 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.45" />
  </svg>
)
const ScribblePink = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 56" fill="none">
    <path d="M6 44 C14 28 22 48 32 30 C40 14 50 44 60 26 C68 12 74 36 78 20" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M10 50 C20 36 30 52 42 38 C52 26 64 46 76 32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
  </svg>
)

const leftColVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}
const fadeUpVariants: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}
const doodleContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const MotionLink = motion.create(Link)

export default function WhoWeAre() {
  const prefersReduced = useReducedMotion()

  /*
    FIX: Track hovered skill card by index.
    useState is reliable — no DOM event.currentTarget issues.
  */
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      <style>{`
        .skill-card {
          display: flex; flex-direction: column; align-items: flex-start;
          gap: 10px; padding: 14px 14px 16px; border-radius: 14px;
          cursor: default;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .skill-card .skill-title { font-size: 13px; font-weight: 700; color: #0e2547; line-height: 1.3; }

        .btn-more {
          position: relative; display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 32px; border-radius: 14px; font-size: 15px; font-weight: 700;
          letter-spacing: 0.04em; text-transform: uppercase; color: #fff;
          text-decoration: none; background: #49d7a4; overflow: hidden;
        }
        .btn-more::before {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
          transform: translateX(-100%); transition: transform 0.45s ease;
        }
        .btn-more:hover::before { transform: translateX(100%); }
        .btn-more .arrow { display: inline-block; transition: transform 0.22s ease; }
        .btn-more:hover .arrow { transform: translateX(5px); }
      `}</style>

      <div className="content-container relative lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">

          {/* LEFT */}
          <motion.div
            className="max-w-[760px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}  // FIX: once:true
            variants={leftColVariants}
          >
            <motion.p className={`${outfit.className} text-[20px] font-bold tracking-[-0.03em] text-[#49d7a4] lg:text-[26px]`} variants={fadeUpVariants}>
              Creative Web Solutions
            </motion.p>

            <motion.div className="mt-3 inline-block" variants={fadeUpVariants}>
              <h2 className={`${epilogue.className} text-[42px] font-extrabold leading-none tracking-[-0.05em] text-[#0e2547] lg:text-[58px]`}>
                Who we are
              </h2>
              <motion.span
                style={{ display: "block", height: "10px", borderRadius: "3px", background: "#49d7a4", marginTop: "8px", transformOrigin: "left center", boxShadow: "0 2px 6px rgba(73,215,164,0.3)" }}
                initial={{ width: "0%", opacity: 0 }}
                whileInView={{ width: "100%", opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}  // FIX: once:true
                transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              />
            </motion.div>

            <motion.p className={`${outfit.className} mt-6 max-w-[640px] text-[16px] leading-8 text-slate-500 lg:text-[18px]`} variants={fadeUpVariants}>
              We are a digital marketing and SEO agency dedicated to helping businesses develop their online presence and really grow.
            </motion.p>

            <motion.h3 className={`${epilogue.className} mt-10 text-[28px] font-extrabold tracking-[-0.04em] text-[#0e2547] lg:text-[36px]`} variants={fadeUpVariants}>
              Check out our skills:
            </motion.h3>

            {/* Skills grid */}
            <motion.div
              className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}  // FIX: once:true
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } } satisfies Variants}
            >
              {skills.map(({ title, Icon, color, bg, bgHover, border }, i) => {
                const isHov = hoveredSkill === i
                return (
                  <motion.div
                    key={title}
                    className="skill-card"
                    style={{
                      border: `1.5px solid ${isHov ? color : border}`,
                      background: isHov ? bgHover : bg,
                      boxShadow: isHov ? "0 6px 20px rgba(15,23,42,0.08)" : "none",
                      transition: "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
                    }}
                    variants={{ hidden: { opacity: 0, y: 20, scale: 0.94 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                    whileHover={prefersReduced ? {} : { y: -6, scale: 1.04, transition: { duration: 0.18 } }}
                    whileTap={prefersReduced ? {} : { scale: 0.97 }}
                    onMouseEnter={() => setHoveredSkill(i)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div style={{ color }}><Icon className="h-[28px] w-[28px]" strokeWidth={2.2} /></div>
                    <p className="skill-title">{title}</p>
                  </motion.div>
                )
              })}
            </motion.div>

            <motion.div variants={fadeUpVariants} className="mt-10">
              <MotionLink
                href="/about"
                className={`${outfit.className} btn-more`}
                whileHover={prefersReduced ? {} : { y: -3, scale: 1.02, boxShadow: "0 8px 28px rgba(73,215,164,0.5)", transition: { duration: 0.22 } }}
                whileTap={prefersReduced ? {} : { y: 0, scale: 0.99, transition: { duration: 0.1 } }}
              >
                More About Us
                <span className="arrow">→</span>
              </MotionLink>
            </motion.div>
          </motion.div>

          {/* RIGHT — doodles */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative h-[520px] w-full max-w-[560px]">
              <div className="absolute left-[16%] top-[10%] h-[400px] w-[400px] rounded-full bg-[#d9d9d9]/35 blur-[2px]" />
              <div className="absolute left-[18%] top-[12%] h-[430px] w-[430px] rounded-full border-[3px] border-[#d8d8d8]" />
              <div className="absolute left-[20%] top-[14%] h-[390px] w-[390px] rounded-full bg-[#49d7a4]" />

              <div className="absolute inset-0 z-10 flex items-end justify-center">
                <Image src="/who-we-are-person.png" alt="Who we are" width={430} height={525} className="h-auto w-[430px] object-contain" />
              </div>

              <motion.div
                className="absolute inset-0 z-20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}  // FIX: once:true
                variants={doodleContainerVariants}
              >
                {/* Cup */}
                <motion.div className="absolute right-[10%] top-[4%] w-[64px] text-[#386edc]"
                  variants={{ hidden: { opacity: 0, y: -24, x: 16, rotate: 15, scale: 0.7 }, visible: { opacity: 1, y: 0, x: 0, rotate: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                  whileHover={prefersReduced ? {} : { scale: 1.15, rotate: 12, transition: { duration: 0.22 } }}
                ><CupIcon /></motion.div>

                {/* GOALS */}
                <motion.div className="absolute left-[0%] top-[36%] w-[130px]"
                  variants={{ hidden: { opacity: 0, x: -36, rotate: -16, scale: 0.8 }, visible: { opacity: 1, x: 0, rotate: -8, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                  whileHover={prefersReduced ? {} : { scale: 1.1, rotate: -4, transition: { duration: 0.22 } }}
                ><GoalsText /></motion.div>

                {/* Arrow */}
                <motion.div className="absolute right-[2%] top-[30%] w-[72px] text-[#7c3aed]"
                  variants={{ hidden: { opacity: 0, y: -20, rotate: -10, scale: 0.75 }, visible: { opacity: 1, y: 0, rotate: 10, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                  whileHover={prefersReduced ? {} : { scale: 1.12, rotate: 18, transition: { duration: 0.2 } }}
                ><ChunkyArrowIcon /></motion.div>

                {/* Blue squiggle */}
                <motion.div className="absolute left-[2%] bottom-[16%] w-[90px] text-[#38bdf8]"
                  variants={{ hidden: { opacity: 0, x: -28, y: 20, rotate: -20 }, visible: { opacity: 1, x: 0, y: 0, rotate: -8, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                  whileHover={prefersReduced ? {} : { scale: 1.1, rotate: 0, transition: { duration: 0.22 } }}
                ><BrushSquiggleBlue /></motion.div>

                {/* Pink scribble */}
                <motion.div className="absolute right-[4%] bottom-[10%] w-[80px] text-[#f43f8e]"
                  variants={{ hidden: { opacity: 0, x: 24, y: 20, rotate: 20 }, visible: { opacity: 1, x: 0, y: 0, rotate: 12, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } } satisfies Variants}
                  whileHover={prefersReduced ? {} : { scale: 1.12, rotate: 20, transition: { duration: 0.2 } }}
                ><ScribblePink /></motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}