"use client"

import Image from "next/image"
import { Epilogue, Outfit } from "next/font/google"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import ServicesDropdown from "./ServicesDropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const logoFont = Epilogue({ subsets: ["latin"], weight: ["800"] })
const navFont  = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] })

const MOBILE_BREAKPOINT = 1024 // px — same as Tailwind's lg

const navItems = [
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "About",    href: "/about" },
  { label: "Work",     href: "/work" },
  { label: "Blog",     href: "/blog" },
]

export default function NavBar() {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  // isMobile = null on first render (SSR safe), then set via useEffect
  const [isMobile, setIsMobile]   = useState<boolean | null>(null)

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // JS-driven breakpoint — avoids Tailwind purge / content-container issues
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Close drawer when resizing to desktop
  useEffect(() => {
    if (isMobile === false) setMenuOpen(false)
  }, [isMobile])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      <style>{`
        /* ── Nav link (desktop) ── */
        .nav-link {
          position: relative;
          font-size: 15px;
          font-weight: 500;
          color: #1e293b;
          text-decoration: none;
          padding: 4px 2px;
          white-space: nowrap;
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -2px;
          height: 2px;
          width: 0;
          background: #e61e73;
          border-radius: 999px;
          transform: translateX(-50%);
          transition: width 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link:hover            { color: #e61e73; }
        .nav-link:hover::after     { width: 100%; }

        /* ── Logo ── */
        .logo-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-word {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #0e2547;
          line-height: 1;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .logo-link:hover .logo-word { color: #e61e73; }
        .logo-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #e61e73;
          margin-left: 1px;
          position: relative;
          top: -8px;
        }

        /* ── CTA pill ── */
        .nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border-radius: 999px;
          background: #0e2547;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.01em;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-cta:hover {
          background: #e61e73;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(230,30,115,0.28);
        }
        .nav-cta:active { transform: translateY(0); }

        /* ── Hamburger ── */
        .ham-btn {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          border-radius: 8px;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .ham-btn:hover { background: #f3f4f6; }
        .ham-line {
          display: block;
          width: 22px;
          height: 2px;
          background: #0e2547;
          border-radius: 999px;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease, width 0.3s ease;
          transform-origin: center;
        }
        .ham-open .ham-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .ham-open .ham-line:nth-child(2) { opacity: 0; width: 0; }
        .ham-open .ham-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile link ── */
        .mob-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 0;
          font-size: 20px;
          font-weight: 700;
          color: #0e2547;
          text-decoration: none;
          border-bottom: 1px solid #f0f0f4;
          letter-spacing: -0.03em;
          transition: color 0.18s ease, padding-left 0.2s ease;
        }
        .mob-link:hover { color: #e61e73; padding-left: 6px; }
        .mob-arrow {
          font-size: 16px;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .mob-link:hover .mob-arrow { opacity: 1; transform: translateX(0); }
      `}</style>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: scrolled ? "0 2px 20px rgba(14,37,71,0.08)" : "none",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <div className="content-container" style={{ paddingLeft: "clamp(16px, 4vw, 40px)", paddingRight: "clamp(16px, 4vw, 40px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76, gap: 24 }}>

            {/* ── Logo ── */}
            <LocalizedClientLink href="/" className="logo-link">
              <Image
                src="/logo.png"
                alt="Mommantum Logo"
                width={36}
                height={36}
                style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }}
                priority
              />
              <span className={`${logoFont.className} logo-word`}>
                mommantum<span className="logo-dot" aria-hidden />
              </span>
            </LocalizedClientLink>

            {/* ── Desktop nav — only render when isMobile is confirmed false ── */}
            {isMobile === false && (
              <div
                className={navFont.className}
                style={{ display: "flex", alignItems: "center", gap: 32 }}
              >
                <div className="group" style={{ position: "relative" }}>
                  <LocalizedClientLink href="/services" className="nav-link">
                    Services
                  </LocalizedClientLink>
                  <ServicesDropdown />
                </div>

                <LocalizedClientLink href="/about" className="nav-link">About</LocalizedClientLink>
                <LocalizedClientLink href="/work"  className="nav-link">Work</LocalizedClientLink>
                <LocalizedClientLink href="/blog"  className="nav-link">Blog</LocalizedClientLink>

                <LocalizedClientLink href="/contact" className="nav-cta">
                  Let&apos;s Talk <span aria-hidden>→</span>
                </LocalizedClientLink>
              </div>
            )}

            {/* ── Mobile hamburger — only when isMobile confirmed true ── */}
            {isMobile === true && (
              <button
                className={`ham-btn${menuOpen ? " ham-open" : ""}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                <span className="ham-line" />
                <span className="ham-line" />
                <span className="ham-line" />
              </button>
            )}

          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.28)", backdropFilter: "blur(2px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              style={{
                position: "fixed",
                inset: "76px 0 auto 0",
                zIndex: 50,
                background: "#fff",
                padding: "8px 20px 32px",
                borderRadius: "0 0 20px 20px",
                boxShadow: "0 20px 50px rgba(14,37,71,0.14)",
              }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={navFont.className}>
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.055 + 0.04, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <LocalizedClientLink
                      href={item.href}
                      className="mob-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                      <span className="mob-arrow">→</span>
                    </LocalizedClientLink>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.055 + 0.1, duration: 0.28 }}
                  style={{ marginTop: 20 }}
                >
                  <LocalizedClientLink
                    href="/contact"
                    className="nav-cta"
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Let&apos;s Talk →
                  </LocalizedClientLink>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.38 }}
                  style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "#94a3b8" }}
                >
                  hello@mommantum.com
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}