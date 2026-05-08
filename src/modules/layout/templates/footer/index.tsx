"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { Epilogue, Outfit } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500"] })

const companyLinks = [
  { name: "Services", href: "/services" },
  { name: "Work", href: "/work" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
]

const performanceServices = [
  { name: "Performance Marketing", href: "/services/performance-marketing" },
  { name: "Conversion Rate Optimization", href: "/services/conversion-rate-optimization" },
  { name: "SEO — AEO & GEO", href: "/services/search-engine-optimization" },
  { name: "Script & Copywriting", href: "/services/script-copywriting" },
  { name: "D2C Branding & Scale Growth", href: "/services/d2c-branding-scale-growth" },
  { name: "Social Media Marketing", href: "/services/social-media-marketing" },
  { name: "Strategy & Consulting", href: "/services/strategy-consulting" },
]

const webAiServices = [
  { name: "Web & App Development", href: "/services/web-app-development" },
  { name: "AI Automation", href: "/services/ai-automation" },
  { name: "AI Agentic Service", href: "/services/ai-agentic-service" },
  { name: "AI Video Generation", href: "/services/ai-video-generation" },
]

const articleLinks = [
  { name: "How great creative improves D2C conversion performance", href: "/blog" },
  { name: "What makes a high-converting ecommerce landing page", href: "/blog" },
  { name: "How brands scale faster with creative systems", href: "/blog" },
]

const popularSearches = `Performance Marketing Agency India · SEO Company in Jaipur · Social Media Marketing Agency in Jaipur · Google Ads Agency · Conversion Rate Optimization · AI Automation Agency · Agentic AI Services · AI Video Generator · Branding Agency in India · D2C Marketing Agency · Web Development Company in Jaipur · Ecommerce Web Development · SEO Agency in Jaipur · Instagram Marketing Agency · UI UX Design Agency · AI Workflow Automation · Brand Identity Design Agency · Shopify SEO Company · D2C Ecommerce Marketing · SEO Expert in Jaipur · Google Shopping Ads Agency · Best AI Video Generator · Social Media Marketing Company in Jaipur · Ecommerce Performance Marketing Agency · Custom Web Development Company · AI Marketing Automation · Brand Strategy Consulting · D2C Marketing Strategy · SEO Packages for Small Business · Digital Branding Agency · Web App Development Company · Building AI Agents · Text to Video Generator AI · SEO Consultant India · Performance Marketing Companies in India`

const seoContent = `Mommantum is a D2C performance marketing agency working with ecommerce brands and product startups across India. We have helped brands cut their CAC by 28%, double revenue in 45 days, and build organic channels that keep bringing in buyers long after ads stop. Our clients come from food and wellness, electronics, F&B, and lifestyle categories. As a performance marketing agency in India, we run Meta ads and Google ads as a full revenue system. We work as an SEO agency across India and are one of the few teams in Jaipur doing AEO and GEO alongside traditional SEO. Our conversion rate optimization agency audits your product pages, checkout flow, and mobile experience. As a social media marketing agency in India, we manage Instagram, YouTube, and LinkedIn with a proper content calendar. Our web development company in Jaipur builds fast, conversion-ready websites and ecommerce web development solutions. We set up AI workflow automation systems and build agentic AI systems — custom AI agents. Based in Jaipur, working with brands across India.`

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17"
    fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
)

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M20.447 20.452H16.89v-5.569c0-1.327-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.983 1.983 0 1 1 0-3.966 1.983 1.983 0 0 1 0 3.966zm1.997 13.019H3.34V9h3.994v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

// ── Mobile-only accordion ─────────────────────────────────────────────────────
function FooterAccordion({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-slate-100 lg:border-none">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between py-4 lg:hidden"
      >
        <span className={`${epilogue.className} text-[15px] font-extrabold tracking-[-0.02em] text-[#0e2547]`}>
          {title}
        </span>
        <ChevronDown
          size={15}
          className="shrink-0 text-slate-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Mobile content */}
      <div
        className="overflow-hidden transition-all duration-300 lg:hidden"
        style={{ maxHeight: open ? "600px" : "0px" }}
      >
        <div className="pb-5">{children}</div>
      </div>

      {/* Desktop — always visible */}
      <div className="hidden lg:block">
        <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
          {title}
        </p>
        {children}
      </div>
    </div>
  )
}

// ── Mobile Quick Links accordion ─────────────────────────────────────────────
function MobileQuickLinks() {
  const [open, setOpen] = useState(false)

  const alwaysVisible = companyLinks[0]
  const hidden = companyLinks.slice(1)

  return (
    <div className="border-b border-slate-100 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between py-4"
      >
        <span className={`${epilogue.className} text-[15px] font-extrabold tracking-[-0.02em] text-[#0e2547]`}>
          Quick Links
        </span>
        <ChevronDown
          size={15}
          className="shrink-0 text-slate-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div className="pb-2">
        <Link
          href={alwaysVisible.href}
          className={`${outfit.className} block py-1.5 text-[13.5px] font-medium text-slate-600 transition-colors hover:text-[#e61e73]`}
        >
          {alwaysVisible.name}
        </Link>
      </div>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "400px" : "0px" }}
      >
        <div className="flex flex-col gap-0 pb-5">
          {hidden.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${outfit.className} py-1.5 text-[13.5px] font-medium text-slate-600 transition-colors hover:text-[#e61e73]`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-100 bg-white">

      <style>{`
        .footer-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: white;
          color: #64748b;
          text-decoration: none;
          transition:
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.2s ease,
            background 0.2s ease;
        }
        .footer-social-btn.instagram:hover {
          border-color: transparent;
          color: white;
          background: linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%);
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 8px 20px rgba(221,42,123,0.3);
        }
        .footer-social-btn.linkedin:hover {
          border-color: transparent;
          color: white;
          background: #0077b5;
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 8px 20px rgba(0,119,181,0.3);
        }
      `}</style>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px] py-10 lg:py-16">

          {/* ── MOBILE LAYOUT ── (unchanged) */}
          <div className="lg:hidden">

            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Mommantum Logo"
                width={36}
                height={36}
                className="h-[36px] w-[36px] flex-shrink-0 object-contain"
              />
              <span className={`${epilogue.className} flex items-center text-[18px] font-extrabold leading-none tracking-[-0.04em] text-[#0e2547]`}>
                mommantum
                <span
                  className="ml-[2px] inline-block rounded-full bg-[#e61e73]"
                  style={{ width: 4, height: 4, verticalAlign: "super", flexShrink: 0 }}
                />
              </span>
            </Link>

            <p className={`${outfit.className} mt-2 text-[13px] text-slate-400`}>
              Growth studio for D2C brands.
            </p>

            <div className="mt-5 rounded-[14px] border border-slate-100 bg-[#f7f8fa] p-5">
              <p className={`${epilogue.className} text-[16px] font-extrabold tracking-[-0.03em] text-[#0e2547]`}>
                Ready to grow?
              </p>
              <p className={`${outfit.className} mt-1.5 text-[13px] leading-[1.7] text-slate-500`}>
                Free strategy call. We tell you exactly what to fix first.
              </p>
              <Link
                href="/contact"
                className={`${epilogue.className} mt-4 inline-flex h-[40px] items-center justify-center gap-1.5 rounded-[10px] bg-[#e61e73] px-6 text-[11.5px] font-extrabold uppercase tracking-[0.07em] text-white transition-all hover:bg-[#ca155f]`}
              >
                Let&apos;s Make It Happen
              </Link>
            </div>

            <div className="mt-4">
              <MobileQuickLinks />
            </div>

            <FooterAccordion title="Performance Marketing">
              <div className="flex flex-col gap-3">
                {performanceServices.map((item) => (
                  <Link key={item.name} href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors hover:text-[#e61e73]`}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </FooterAccordion>

            <FooterAccordion title="Web & AI">
              <div className="flex flex-col gap-3">
                {webAiServices.map((item) => (
                  <Link key={item.name} href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors hover:text-[#9333ea]`}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </FooterAccordion>

            <FooterAccordion title="Articles">
              <div className="flex flex-col gap-4">
                {articleLinks.map((item) => (
                  <Link key={item.name} href={item.href}
                    className={`${outfit.className} block text-[13.5px] leading-[1.65] text-slate-600 transition-colors hover:text-[#0e2547]`}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </FooterAccordion>

            <div className="mt-6 flex items-center gap-3">
              <Link href="https://www.instagram.com/mommantummedia?igsh=OXpxZ3Y0aTAxMTk4"
                target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="footer-social-btn instagram">
                <InstagramIcon />
              </Link>
              <Link href="https://www.linkedin.com/company/mommantum-media/"
                target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="footer-social-btn linkedin">
                <LinkedInIcon />
              </Link>
            </div>
          </div>

          {/* ── DESKTOP LAYOUT ── */}
          {/*
            Column order:
            1. Logo + tagline + CTA block + socials   (240px fixed)
            2. Quick Links (Services → T&C)            (160px fixed)
            3. Performance Marketing                   (1fr)
            4. Web & AI                                (1fr)
            5. Articles                                (1fr)
          */}
          <div className="hidden lg:grid lg:grid-cols-[240px_160px_1fr_1fr_1fr] lg:gap-x-10 xl:gap-x-14 lg:items-start">

            {/* ── Col 1: Brand + CTA + Socials ── */}
            <div className="flex flex-col">
              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-2.5">
                <Image
                  src="/logo.png"
                  alt="Mommantum Logo"
                  width={38}
                  height={38}
                  className="h-[38px] w-[38px] flex-shrink-0 object-contain"
                />
                <span className={`${epilogue.className} flex items-center text-[19px] font-extrabold leading-none tracking-[-0.04em] text-[#0e2547]`}>
                  mommantum
                  <span
                    className="ml-[2px] inline-block rounded-full bg-[#e61e73]"
                    style={{ width: 5, height: 5, verticalAlign: "super", flexShrink: 0 }}
                  />
                </span>
              </Link>

              {/* Tagline */}
              <p className={`${outfit.className} mt-3 text-[13px] leading-relaxed text-slate-400`}>
                Growth studio for D2C brands.
              </p>

              {/* Divider */}
              <div className="my-5 h-px w-full bg-slate-100" />

              {/* CTA block */}
              <p className={`${epilogue.className} text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                Let&apos;s Work
              </p>
              <h3 className={`${epilogue.className} mt-3 text-[17px] font-extrabold leading-snug tracking-[-0.03em] text-[#0e2547]`}>
                Ready to grow your brand?
              </h3>
              <p className={`${outfit.className} mt-2 text-[13px] leading-[1.75] text-slate-500`}>
                Free strategy call. We tell you exactly what to fix first.
              </p>
              <Link
                href="/contact"
                className={`${epilogue.className} mt-4 inline-flex h-[40px] w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#e61e73] px-5 text-[11px] font-extrabold uppercase tracking-[0.07em] text-white transition-all duration-200 hover:bg-[#ca155f] hover:shadow-md`}
              >
                Let&apos;s Make It Happen
              </Link>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-[5px] w-[5px] rounded-full bg-[#49d7a4]" />
                <p className={`${outfit.className} text-[12px] text-slate-400`}>
                  No commitment. Just clarity.
                </p>
              </div>

              {/* Socials */}
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="https://www.instagram.com/mommantummedia?igsh=OXpxZ3Y0aTAxMTk4"
                  target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="footer-social-btn instagram"
                >
                  <InstagramIcon />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/mommantum-media/"
                  target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="footer-social-btn linkedin"
                >
                  <LinkedInIcon />
                </Link>
              </div>
            </div>

            {/* ── Col 2: Quick Links ── */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                Quick Links
              </p>
              <div className="flex flex-col gap-3">
                {companyLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium text-slate-600 transition-colors duration-200 hover:text-[#e61e73]`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Col 3: Performance Marketing ── */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                Performance Marketing
              </p>
              <div className="flex flex-col gap-3">
                {performanceServices.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors duration-200 hover:text-[#e61e73]`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Col 4: Web & AI ── */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                Web & AI
              </p>
              <div className="flex flex-col gap-3">
                {webAiServices.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors duration-200 hover:text-[#9333ea]`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Col 5: Articles ── */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                Articles
              </p>
              <div className="flex flex-col gap-4">
                {articleLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${outfit.className} block text-[13.5px] leading-[1.65] text-slate-600 transition-colors duration-200 hover:text-[#0e2547]`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar — unchanged */}
      <div className="border-t border-slate-100 bg-[#f7f8fa]">
        <div className="content-container px-4 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-2.5 py-4 md:flex-row md:items-center md:justify-between">
            <p className={`${outfit.className} text-[12px] text-slate-400`}>
              © 2026 Mommantum. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link href="/privacy-policy" className={`${outfit.className} text-[12px] text-slate-400 hover:text-[#0e2547] transition-colors`}>
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className={`${outfit.className} text-[12px] text-slate-400 hover:text-[#0e2547] transition-colors`}>
                Terms & Conditions
              </Link>
              <Link href="/contact" className={`${outfit.className} text-[12px] text-slate-400 hover:text-[#0e2547] transition-colors`}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden SEO block */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", width: "1px", height: "1px",
          padding: 0, margin: "-1px", overflow: "hidden",
          clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0,
        }}
      >
        <h2>Popular Searches</h2>
        <p>{popularSearches}</p>
        <h2>Growth Studio for D2C Brands</h2>
        <p>{seoContent}</p>
      </div>

    </footer>
  )
}