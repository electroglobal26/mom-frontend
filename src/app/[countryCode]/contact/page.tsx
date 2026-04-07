"use client"

import { Epilogue, Outfit, Mansalva } from "next/font/google"
import { useEffect, useRef, useState } from "react"
import GoogleFormContact from "@modules/contact/components/google-form-contact"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

const stripItems = [
  "Get in touch with our team",
  "We'd love to hear from you",
  "Let's build something great",
  "Get in touch with our team",
  "We'd love to hear from you",
  "Let's build something great",
]

export default function ContactPage() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const msgRef = useRef<HTMLDivElement>(null)
  const [underlineVisible, setUnderlineVisible] = useState(false)
  const [msgJumped, setMsgJumped] = useState(false)

  // Hero underline draw
  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setUnderlineVisible(false)
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setUnderlineVisible(true))
          )
        } else {
          setUnderlineVisible(false)
        }
      },
      { threshold: 0.6 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // "Message us" jump on scroll into view
  useEffect(() => {
    const el = msgRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMsgJumped(false)
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setMsgJumped(true))
          )
          obs.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Generic scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).style.opacity = "1"
            ;(entry.target as HTMLElement).style.transform = "translateY(0)"
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main className="relative overflow-hidden bg-white">
      <style>{`

        /* ─── Hero underline ─── */
        @keyframes drawUnderline {
          from { width: 0%; opacity: 0; }
          to   { width: 100%; opacity: 1; }
        }
        .underline-animate {
          display: block;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, #a855f7, #e61e73);
          width: 0%;
          opacity: 0;
          margin: 8px auto 0;
        }
        .underline-animate.visible {
          animation: drawUnderline 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* ─── Hero stagger ─── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-label { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .hero-h1    { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.18s both; }
        .hero-sub   { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.32s both; }

        /* ─── "Message us" spring jump ─── */
        @keyframes jumpIn {
          0%   { opacity: 0; transform: translateY(40px) scale(0.94); }
          55%  { opacity: 1; transform: translateY(-10px) scale(1.03); }
          75%  { transform: translateY(4px) scale(0.99); }
          90%  { transform: translateY(-3px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .msg-jump {
          opacity: 0;
        }
        .msg-jump.active {
          animation: jumpIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* ─── Scroll reveal ─── */
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
                      transform 0.65s cubic-bezier(0.16,1,0.3,1);
        }

        /* ─── Marquee ─── */
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover { animation-play-state: paused; }

        /* ─── Social icon spring ─── */
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1.5px solid #e2e8f0;
          background: white;
          font-size: 15px;
          font-weight: 800;
          color: #0e2547;
          text-decoration: none;
          transition:
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.2s ease;
        }
        .social-btn:hover {
          border-color: #e61e73;
          color: #e61e73;
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 8px 22px rgba(230,30,115,0.18);
        }

        /* ─── Info card ─── */
        .info-card {
          background: white;
          border-radius: 18px;
          padding: 30px 34px;
          border: 1px solid #ededf2;
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .info-card:hover {
          box-shadow: 0 14px 44px rgba(14,37,71,0.09);
          transform: translateY(-3px);
        }

        /* ─── Map card ─── */
        .map-card {
          overflow: hidden;
          border-radius: 24px;
          box-shadow:
            0 20px 60px rgba(14,37,71,0.09),
            0 4px 16px rgba(14,37,71,0.05);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .map-card:hover {
          box-shadow:
            0 28px 72px rgba(14,37,71,0.13),
            0 6px 20px rgba(14,37,71,0.07);
          transform: translateY(-3px);
        }

        /* ─── Heading accent underline ─── */
        .h-accent {
          position: relative;
          display: inline-block;
        }
        .h-accent::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 0;
          width: 55%;
          height: 10px;
          background: #ef6a99;
          z-index: -1;
          border-radius: 2px;
        }

        /* ─── Section divider ─── */
        .section-rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e8e8ef 30%, #e8e8ef 70%, transparent);
          margin: 0 auto;
        }
      `}</style>

      {/* ════ HERO ════ */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[5%] top-[6%] h-[160px] w-[420px] rounded-full bg-purple-50 opacity-70 blur-3xl" />
          <div className="absolute right-[6%] top-[12%] h-[140px] w-[360px] rounded-full bg-pink-50 opacity-60 blur-3xl" />
          <div className="absolute right-[-3%] top-[4%] h-[380px] w-[380px] rounded-full border-[40px] border-slate-100 opacity-40" />
          <div className="absolute left-[-2%] bottom-[8%] h-[200px] w-[200px] rounded-full border-[28px] border-purple-50 opacity-50" />
        </div>

        <div className="content-container relative px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1320px] text-center">

            <p className={`${mansalva.className} hero-label mb-3 text-[21px] text-[#e61e73]`}>
              Contact us
            </p>

            <h1
              ref={headingRef}
              className={`${epilogue.className} hero-h1 inline-block text-[40px] font-extrabold leading-[0.95] tracking-[-0.05em] text-[#0e2547] sm:text-[54px] lg:text-[68px]`}
            >
              We are Mommantum!
              <span className={`underline-animate${underlineVisible ? " visible" : ""}`} />
            </h1>

            <p className={`${outfit.className} hero-sub mx-auto mt-6 max-w-[460px] text-[16px] leading-relaxed text-slate-400`}>
              Tell us about your project — we typically reply within one business day.
            </p>

          </div>
        </div>
      </section>

      {/* ════ MARQUEE STRIP ════ */}
      <div className="overflow-hidden bg-[#0e2547] py-[13px]">
        <div className="marquee-track">
          {[0, 1].map((set) =>
            stripItems.map((text, i) => (
              <span
                key={`${set}-${i}`}
                className={`${epilogue.className} flex items-center whitespace-nowrap`}
              >
                <span className="px-7 text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-white">
                  {text}
                </span>
                <span style={{
                  display: "inline-block",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#ef6a99",
                  flexShrink: 0,
                }} />
              </span>
            ))
          )}
        </div>
      </div>

      {/* ════ MESSAGE US + FORM ════ */}
      <section className="relative overflow-hidden bg-[#f5f5f7] py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[3%] top-[6%] h-[130px] w-[400px] rounded-full bg-white/60 blur-3xl" />
          <div className="absolute right-[4%] bottom-[6%] h-[120px] w-[360px] rounded-full bg-white/50 blur-3xl" />
        </div>

        <div className="content-container relative px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1320px]">

            {/* "Message us" — spring jump heading */}
            <div
              ref={msgRef}
              className={`mx-auto max-w-[660px] text-center msg-jump${msgJumped ? " active" : ""}`}
            >
              <h2
                className={`${epilogue.className} text-[36px] font-extrabold tracking-[-0.05em] text-[#0e2547] sm:text-[46px] lg:text-[56px]`}
              >
                <span className="h-accent">Message us</span>
              </h2>
              <p className={`${outfit.className} mt-4 text-[15px] leading-relaxed text-slate-400`}>
                Fill in the form and we&apos;ll get back to you shortly.
              </p>
            </div>

            {/* Form */}
            <div className="reveal mt-12" style={{ transitionDelay: "0.12s" }}>
              <GoogleFormContact />
            </div>

          </div>
        </div>
      </section>

      {/* ════ INQUIRIES + SOCIAL ════ */}
      <section className="relative bg-[#f5f5f7] pb-20 lg:pb-24">
        <div className="content-container px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1320px]">

            {/* subtle top rule to separate from form section */}
            <div className="section-rule mb-16" />

            <div className="grid gap-6 md:grid-cols-2">

              {/* General Inquiries */}
              <div className="reveal info-card" style={{ transitionDelay: "0.05s" }}>
                <p className={`${mansalva.className} mb-2 text-[14px] text-[#e61e73]`}>
                  reach out directly
                </p>
                <h3 className={`${epilogue.className} text-[26px] font-extrabold tracking-[-0.04em] text-[#0e2547] lg:text-[32px]`}>
                  <span className="h-accent">General Inquiries</span>
                </h3>
                <a
                  href="mailto:hello@mommantum.com"
                  className={`${outfit.className} mt-5 inline-flex items-center gap-2 text-[16px] text-slate-500 transition-colors duration-200 hover:text-[#e61e73]`}
                >
                  hello@mommantum.com
                </a>
              </div>

              {/* Social Networks */}
              <div className="reveal info-card" style={{ transitionDelay: "0.12s" }}>
                <p className={`${mansalva.className} mb-2 text-[14px] text-[#e61e73]`}>
                  follow our journey
                </p>
                <h3 className={`${epilogue.className} text-[26px] font-extrabold tracking-[-0.04em] text-[#0e2547] lg:text-[32px]`}>
                  <span className="h-accent">Social Networks</span>
                </h3>
                <div className="mt-6 flex items-center gap-3">
                  {[
                    { icon: "IG", label: "Instagram" },
                    { icon: "in", label: "LinkedIn" },
                    { icon: "X",  label: "X / Twitter" },
                    { icon: "▶", label: "YouTube" },
                  ].map(({ icon, label }) => (
                    <a
                      key={icon}
                      href="#"
                      aria-label={label}
                      className="social-btn"
                      style={{ fontFamily: epilogue.style.fontFamily }}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ════ MAP ════ */}
      <section className="bg-white py-20 lg:py-24">
        <div className="content-container px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1320px]">

            <div className="reveal text-center">
              <p className={`${mansalva.className} text-[20px] text-[#e61e73]`}>
                Let&apos;s meet!
              </p>
              <h2 className={`${epilogue.className} mt-2 text-[34px] font-extrabold tracking-[-0.05em] text-[#0e2547] lg:text-[50px]`}>
                <span className="h-accent">Headquarters</span>
              </h2>
              <p className={`${outfit.className} mx-auto mt-3 text-[15px] text-slate-400`}>
                Jaipur, Rajasthan, India
              </p>
            </div>

            <div className="reveal map-card mt-12" style={{ transitionDelay: "0.1s" }}>
              <iframe
                src="https://www.google.com/maps?q=Jaipur%2C%20Rajasthan%2C%20India&z=12&output=embed"
                width="100%"
                height="460"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mommantum Headquarters Map"
              />
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}