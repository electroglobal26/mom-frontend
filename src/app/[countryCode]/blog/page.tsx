import Image from "next/image"
import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import ManualSeoSchema from "@modules/common/components/manual-seo-schema"
import { getBlogPosts } from "@lib/data/blog-posts"
import { buildSeoMetadata, getSeoSetting } from "@lib/data/seo"
import { Epilogue, Outfit, Mansalva } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata(["blog"], {
    title: "Blog | Mommantum",
    description:
      "Read Mommantum insights on performance marketing, SEO, branding, content, ecommerce growth, and AI workflows.",
    canonicalPath: "/blog",
  })
}

export default async function BlogPage() {
  const [blogPosts, seoSetting] = await Promise.all([
    getBlogPosts(),
    getSeoSetting("blog")
  ])

  const [featured, ...rest] = blogPosts

  if (!featured) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f3f4f6]">
        <div className="text-center">
          <p className="text-slate-400 text-lg">No blog posts yet.</p>
          <p className="text-slate-300 text-sm mt-2">
            Backend: {process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "NOT SET"}
          </p>
        </div>
      </main>
    )
  }

  const popular = blogPosts.slice(0, 5)

  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <main className="relative overflow-hidden bg-[#f3f4f6] pt-14 pb-18 lg:pt-18 lg:pb-22">
      <SeoJsonLd pageKeys={["blog"]} />
      <ManualSeoSchema 
        type="blog-listing" 
        data={{
          ...(seoSetting || {}),
          category_title: seoSetting?.meta_title || "Blog | Mommantum",
          meta_description: seoSetting?.meta_description || "Read Mommantum insights on performance marketing, SEO, branding, content, ecommerce growth, and AI workflows.",
          blog_posts: blogPosts,
          faq_json_10: (seoSetting as any)?.faq_section || []
        }} 
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-[8%] h-[130px] w-[400px] rounded-full bg-white/45 blur-3xl" />
        <div className="absolute right-[6%] top-[10%] h-[140px] w-[340px] rounded-full bg-white/40 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          <div className="max-w-[680px]">
            <p className={`${mansalva.className} mb-3 text-[22px] text-[#e61e73]`}>
              Blog
            </p>
            <h1 className={`${epilogue.className} text-[36px] font-extrabold leading-[0.95] tracking-[-0.06em] text-[#0e2547] sm:text-[48px] lg:text-[62px]`}>
              <span className="relative inline-block">
                News & stuff
                <span className="absolute bottom-[6px] left-0 -z-10 h-[13px] w-[58%] bg-[#ef6a99]" />
              </span>
            </h1>
            <p className={`${outfit.className} mt-5 max-w-[560px] text-[16px] leading-8 text-slate-600`}>
              We write about what we see working, what is not working, and how brands can grow without wasting time and money on the wrong things. If you run a D2C brand or an ecommerce business and want to get better at performance marketing, branding, content, or just marketing in general, this is the right place.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">

            {/* LEFT */}
            <div>
              {/* Featured */}
              <article className="group">
                <LocalizedClientLink href={`/blog/${featured.slug}`} className="block">
                  <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.07)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_26px_60px_rgba(0,0,0,0.11)]">
                    <div className="relative aspect-[16/9] w-full">
                      {featured.featured_image ? (
                        <Image
                          src={featured.featured_image}
                          alt={featured.title}
                          fill
                          priority
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#0e2547] to-[#e61e73]" />
                      )}
                      <div className="absolute left-4 top-4">
                        {featured.category_id && (
                          <span className={`${mansalva.className} rounded-full bg-[#e61e73] px-4 py-1.5 text-[14px] text-white`}>
                            {featured.category_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </LocalizedClientLink>
                <div className="mt-5">
                  <p className={`${outfit.className} text-[13px] font-semibold uppercase tracking-[0.04em] text-slate-400`}>
                    {formatDate(featured.published_at)}
                  </p>
                  <h2 className={`${epilogue.className} mt-2 text-[28px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#0e2547] lg:text-[34px]`}>
                    <LocalizedClientLink
                      href={`/blog/${featured.slug}`}
                      className="hover:text-[#e61e73] transition-colors"
                    >
                      {featured.title}
                    </LocalizedClientLink>
                  </h2>
                  <p className={`${outfit.className} mt-3 text-[15px] leading-[1.85] text-slate-600`}>
                    {featured.excerpt}
                  </p>
                  <LocalizedClientLink
                    href={`/blog/${featured.slug}`}
                    className={`${epilogue.className} mt-4 inline-flex items-center text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#0e2547] hover:text-[#e61e73] transition-colors`}
                  >
                    Read Article <span className="ml-1.5 text-[16px]">›</span>
                  </LocalizedClientLink>
                </div>
              </article>

              {rest.length > 0 && (
                <div className="my-10 border-t border-slate-200" />
              )}

              {/* Rest list */}
              <div className="space-y-8">
                {rest.map((post) => (
                  <article key={post.slug} className="group flex gap-5">
                    <LocalizedClientLink href={`/blog/${post.slug}`} className="shrink-0">
                      <div className="overflow-hidden rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.07)]">
                        <div className="relative h-[110px] w-[160px]">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-[#0e2547] to-[#e61e73]" />
                          )}
                        </div>
                      </div>
                    </LocalizedClientLink>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3">
                        {post.category_id && (
                          <p className={`${mansalva.className} text-[15px] text-[#e61e73]`}>
                            {post.category_id}
                          </p>
                        )}
                        {post.category_id && post.published_at && (
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                        )}
                        <p className={`${outfit.className} text-[12px] font-semibold uppercase tracking-[0.04em] text-slate-400`}>
                          {formatDate(post.published_at)}
                        </p>
                      </div>
                      <h3 className={`${epilogue.className} mt-1.5 text-[18px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0e2547] lg:text-[20px]`}>
                        <LocalizedClientLink
                          href={`/blog/${post.slug}`}
                          className="hover:text-[#e61e73] transition-colors"
                        >
                          {post.title}
                        </LocalizedClientLink>
                      </h3>
                      <p className={`${outfit.className} mt-1.5 line-clamp-2 text-[14px] leading-[1.7] text-slate-600`}>
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-7 lg:sticky lg:top-[100px]">

              <div className="rounded-[20px] bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
                <h3 className={`${epilogue.className} mb-5 text-[18px] font-extrabold tracking-[-0.03em] text-[#0e2547]`}>
                  Popular articles
                </h3>
                <div className="space-y-5">
                  {popular.map((post, i) => (
                    <div key={post.slug} className="flex gap-3">
                      <span className={`${epilogue.className} mt-0.5 shrink-0 text-[13px] font-extrabold text-[#99dcf8]`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <LocalizedClientLink href={`/blog/${post.slug}`}>
                          <h4 className={`${epilogue.className} text-[14px] font-extrabold leading-[1.3] tracking-[-0.02em] text-[#0e2547] hover:text-[#e61e73] transition-colors`}>
                            {post.title}
                          </h4>
                        </LocalizedClientLink>
                        <p className={`${outfit.className} mt-1 text-[12px] text-slate-400`}>
                          {formatDate(post.published_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] bg-[#0e2547] p-6 text-white shadow-[0_12px_35px_rgba(0,0,0,0.1)]">
                <p className={`${mansalva.className} text-[16px] text-[#ef6a99]`}>
                  Want to work with us?
                </p>
                <h3 className={`${epilogue.className} mt-2 text-[22px] font-extrabold tracking-[-0.04em]`}>
                  Let's build your growth system
                </h3>
                <p className={`${outfit.className} mt-3 text-[13px] leading-6 text-white/80`}>
                  Strategy, creative, and performance — all aligned.
                </p>
                <LocalizedClientLink
                  href="/contact"
                  className={`${epilogue.className} mt-5 inline-flex h-[46px] items-center justify-center rounded-[12px] bg-[#e61e73] px-6 text-[13px] font-extrabold uppercase tracking-[0.03em] text-white transition-all hover:bg-[#ca155f]`}
                >
                  Let's Talk ›
                </LocalizedClientLink>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
