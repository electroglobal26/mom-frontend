"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const leftServices = [
  { name: "Branding & visual design", link: "/services/branding-visual-design" },
  { name: "Web and app development", link: "/services/ecommerce-development" },
  { name: "Ai automation and ai agentic service", link: "/services/software-as-a-service" },
  { name: "UX / UI design", link: "/services/ux-ui-design" },
  { name: "Web design & development", link: "/services/web-design-development" },
  { name: "WordPress web design", link: "/services/wordpress-web-design" },
]

const rightServices = [
  { name: "Search engine optimization - AEO & GEO", link: "/services/search-engine-optimization" },
  { name: "Content & copywriting", link: "/services/content-copywriting" },
  { name: "D2C overall branding and scale growth", link: "/services/email-marketing" },
  { name: "Performance marketing - meta ads, google ads", link: "/services/pay-per-click-management" },
  { name: "SMO and Content Creation", link: "/services/social-media-marketing" },
  { name: "Strategy & consulting", link: "/services/strategy-consulting" },
]

export default function ServicesDropdown() {
  return (
    <div className="invisible absolute right-0 top-full z-50 mt-4 w-[620px] rounded-[22px] border border-neutral-200 bg-white p-7 opacity-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="mb-5">
        <LocalizedClientLink
          href="/services"
          className="inline-flex rounded-[14px] bg-[#f6f7f8] px-4 py-3 text-[13px] font-extrabold uppercase tracking-[0.03em] text-[#0e2547] transition hover:bg-[#eef0f2]"
        >
          View all services
        </LocalizedClientLink>
      </div>

      <div className="grid grid-cols-2 gap-10">
        {/* Left column */}
        <div>
          <h3 className="mb-3 text-[20px] font-extrabold tracking-[-0.03em] text-[#0e2547]">
            Performance Marketing
          </h3>

          <p className="mb-5 text-[15px] leading-7 text-neutral-500">
            We help you get the right people to your website, turn them into customers, and grow your sales using ads, content, and simple strategies.
          </p>

          <div className="space-y-1.5">
            {leftServices.map((item) => (
              <LocalizedClientLink
                key={item.name}
                href={item.link}
                className="block rounded-[12px] px-3 py-2.5 text-[15px] font-medium text-neutral-700 transition hover:bg-rose-50 hover:text-rose-600"
              >
                {item.name}
              </LocalizedClientLink>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div>
          <h3 className="mb-3 text-[20px] font-extrabold tracking-[-0.03em] text-[#0e2547]">
            Web Development and AI Development

          </h3>

          <p className="mb-5 text-[15px] leading-7 text-neutral-500">
           We build websites, apps, and AI automations & agents that are easy to use, fast, and help you run your business better as you grow. 
          </p>

          <div className="space-y-1.5">
            {rightServices.map((item) => (
              <LocalizedClientLink
                key={item.name}
                href={item.link}
                className="block rounded-[12px] px-3 py-2.5 text-[15px] font-medium text-neutral-700 transition hover:bg-rose-50 hover:text-rose-600"
              >
                {item.name}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}