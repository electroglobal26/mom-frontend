import { notFound } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getServices, getService } from "@lib/data/services"
import { Epilogue, Outfit, Mansalva } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

type Props = {
  params: Promise<{
    slug: string
    countryCode: string
  }>
}

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export default async function ServiceDetailPage(props: Props) {
  const params = await props.params
  const service = await getService(params.slug)

  if (!service) return notFound()

  return (
    <main className="relative overflow-hidden bg-[#f3f4f6] pt-14 pb-20 lg:pt-20 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[4%] top-[10%] h-[140px] w-[420px] rounded-full bg-white/45 blur-3xl" />
        <div className="absolute right-[8%] top-[12%] h-[140px] w-[360px] rounded-full bg-white/35 blur-3xl" />
        <div className="absolute left-[16%] bottom-[8%] h-[120px] w-[380px] rounded-full bg-white/30 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">
          <LocalizedClientLink
            href="/services"
            className={`${outfit.className} inline-flex items-center text-[15px] font-semibold text-slate-500 transition-colors hover:text-[#0e2547]`}
          >
            ← Back to Services
          </LocalizedClientLink>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_400px] lg:items-start">
            <div>
              <p className={`${mansalva.className} text-[22px] font-bold text-[#e61e73]`}>
                {service.shortLabel}
              </p>

              <h1 className={`${epilogue.className} mt-3 max-w-[780px] text-[38px] font-extrabold leading-[0.95] tracking-[-0.06em] text-[#0e2547] sm:text-[50px] lg:text-[66px]`}>
                {service.title}
              </h1>

              <p className={`${outfit.className} mt-6 max-w-[820px] text-[18px] leading-9 text-slate-500`}>
                {service.intro}
              </p>
            </div>

            <div className="rounded-[22px] bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
              <h2 className={`${epilogue.className} text-[24px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                Outcomes
              </h2>

              <ul className="mt-5 space-y-4">
                {service.outcomes.map((item) => (
                  <li
                    key={item}
                    className={`${outfit.className} flex items-start gap-3 text-[16px] leading-8 text-slate-500`}
                  >
                    <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#99dcf8]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 rounded-[24px] bg-white px-8 py-10 shadow-[0_24px_60px_rgba(0,0,0,0.08)] lg:px-12 lg:py-12">
            <p className={`${mansalva.className} text-[22px] text-[#e61e73]`}>
              Service focus
            </p>

            <h2 className={`${epilogue.className} mt-3 max-w-[900px] text-[30px] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#0e2547] lg:text-[44px]`}>
              We build this service as part of a larger growth system, not as a disconnected deliverable.
            </h2>

            <p className={`${outfit.className} mt-5 max-w-[940px] text-[16px] leading-8 text-slate-500`}>
              Strong service work happens when business goals, communication, positioning, and execution move together. That is why our process stays focused on clarity, consistency, and meaningful outcomes instead of isolated activity. Every recommendation and every output should strengthen the brand as a whole.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[22px] bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] lg:p-10">
              <h3 className={`${epilogue.className} text-[26px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                What we do
              </h3>

              <ul className="mt-5 space-y-4">
                {service.points.map((item) => (
                  <li
                    key={item}
                    className={`${outfit.className} flex items-start gap-3 text-[16px] leading-8 text-slate-500`}
                  >
                    <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#ef6a99]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[22px] bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] lg:p-10">
              <h3 className={`${epilogue.className} text-[26px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                Why it matters
              </h3>

              <p className={`${outfit.className} mt-5 text-[16px] leading-8 text-slate-500`}>
                The strongest services are not isolated tasks. They become part
                of a larger growth system. Whether the focus is design, content,
                SEO, or paid performance, the goal is always the same: improve
                clarity, create stronger communication, and help the brand move
                forward with more confidence.
              </p>

              <p className={`${outfit.className} mt-5 text-[16px] leading-8 text-slate-500`}>
                When the service is aligned with positioning, messaging, and
                execution, the result becomes more durable. That is where
                stronger momentum usually starts.
              </p>

              <div className="mt-8">
                <LocalizedClientLink
                  href="/contact"
                  className={`${epilogue.className} inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[#e61e73] px-8 text-[15px] font-extrabold uppercase tracking-[0.02em] text-white transition-all duration-300 hover:bg-[#ca155f]`}
                >
                  Let&apos;s Talk
                  <span className="ml-2 text-[18px] leading-none">›</span>
                </LocalizedClientLink>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}