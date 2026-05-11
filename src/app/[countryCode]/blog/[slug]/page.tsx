import Image from "next/image"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import ManualSeoSchema from "@modules/common/components/manual-seo-schema"
import { getBlogPost, getBlogPosts } from "@lib/data/blog-posts"
import { buildSeoMetadata, getSeoSetting } from "@lib/data/seo"
import { Epilogue, Outfit, Mansalva } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

export const dynamicParams = true
export const revalidate = 60

export async function generateMetadata(props: {
  params: Promise<{ slug: string; countryCode: string }>
}): Promise<Metadata> {
  const params = await props.params
  const post = await getBlogPost(params.slug)
  if (!post) return {}

  return buildSeoMetadata(
    [
      `blog:${params.slug}`,
      `blog-post:${params.slug}`,
      `post:${params.slug}`,
      `blog-${params.slug}`,
      params.slug,
    ],
    {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      canonicalPath: `/blog/${params.slug}`,
      image: post.featured_image,
      type: "article",
      keywords: [post.category_id || ""],
    }
  )
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts()
    return posts.slice(0, 10).map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export default async function BlogDetailPage(props: {
  params: Promise<{ slug: string; countryCode: string }>
}) {
  const params = await props.params

  let post
  try {
    post = await getBlogPost(params.slug)
  } catch (err) {
    console.error("BlogDetailPage fetch error:", err)
    return notFound()
  }

  if (!post) return notFound()
  const seoKeys = [
    `blog:${params.slug}`,
    `blog-post:${params.slug}`,
    `post:${params.slug}`,
    `blog-${params.slug}`,
    params.slug,
  ]

  let popularPosts: Awaited<ReturnType<typeof getBlogPosts>> = []
  let seoSetting = null
  try {
    const [posts, seo] = await Promise.all([
      getBlogPosts(),
      getSeoSetting(`blog:${params.slug}`)
    ])
    popularPosts = posts.filter((item) => item.slug !== params.slug).slice(0, 5)
    seoSetting = seo
  } catch {
    popularPosts = []
  }

  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return ""
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric", month: "long", day: "numeric",
      })
    } catch {
      return ""
    }
  }

  const validImages = post.image_urls?.filter(Boolean) || []

  return (
    <main className="relative overflow-hidden bg-[#f3f4f6] pt-14 pb-20 lg:pt-18 lg:pb-24">
      <SeoJsonLd pageKeys={seoKeys} />
      <ManualSeoSchema 
        type="blog" 
        data={{
          ...(seoSetting || {}),
          title: post.title,
          meta_description: seoSetting?.meta_description || post.meta_description || post.excerpt || "",
          featured_image: post.featured_image,
          published_date: post.published_at,
          modified_date: post.updated_at || post.published_at,
          author: post.author_name,
          page_url: `https://www.mommantum.com/in/blog/${params.slug}`,
          category_name: post.category_id || "Growth",
          category_slug: post.category_id?.toLowerCase().replace(/\s+/g, "-") || "growth",
          recent_posts: popularPosts.map(p => ({
            title: p.title,
            url: `https://www.mommantum.com/in/blog/${p.slug}`
          })),
          faq_json_10: (seoSetting as any)?.faq_section || []
        }} 
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[4%] top-[5%] h-[180px] w-[500px] rounded-full bg-white/50 blur-3xl" />
        <div className="absolute right-[6%] top-[8%] h-[160px] w-[400px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[20%] bottom-[10%] h-[140px] w-[460px] rounded-full bg-white/30 blur-3xl" />
      </div>

      <style>{`
        .blog-content { font-family: inherit; }
        .blog-content h2 {
          font-size: 26px; font-weight: 800; color: #0e2547;
          letter-spacing: -0.04em; margin: 36px 0 14px; line-height: 1.1;
          padding-bottom: 10px; border-bottom: 2px solid #f1f5f9;
        }
        .blog-content h2:first-child { margin-top: 0; }
        .blog-content h3 { font-size: 20px; font-weight: 700; color: #0e2547; margin: 28px 0 10px; line-height: 1.2; }
        .blog-content h4 { font-size: 17px; font-weight: 700; color: #1e3a5f; margin: 20px 0 8px; }
        .blog-content p { font-size: 16px; line-height: 2; color: #475569; margin: 14px 0; }
        .blog-content strong { font-weight: 700; color: #0e2547; }
        .blog-content em { font-style: italic; }
        .blog-content u { text-decoration: underline; }
        .blog-content s { text-decoration: line-through; color: #94a3b8; }
        .blog-content ul { list-style: none; padding: 0; margin: 20px 0; }
        .blog-content ul li {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 16px; line-height: 1.85; color: #475569;
          margin: 10px 0; padding: 10px 14px;
          background: #f8fafc; border-radius: 10px; border-left: 3px solid #e61e73;
        }
        .blog-content ul li::before {
          content: ""; display: inline-block; width: 7px; height: 7px;
          border-radius: 50%; background: #e61e73; flex-shrink: 0; margin-top: 9px;
        }
        .blog-content ol { padding-left: 0; margin: 20px 0; counter-reset: ol-counter; list-style: none; }
        .blog-content ol li {
          counter-increment: ol-counter; display: flex; align-items: flex-start;
          gap: 14px; font-size: 16px; line-height: 1.85; color: #475569;
          margin: 10px 0; padding: 10px 14px; background: #f8fafc; border-radius: 10px;
        }
        .blog-content ol li::before {
          content: counter(ol-counter); display: flex; align-items: center;
          justify-content: center; min-width: 26px; height: 26px;
          border-radius: 50%; background: #0e2547; color: white;
          font-size: 12px; font-weight: 800; flex-shrink: 0; margin-top: 2px;
        }
        .blog-content h2:first-child {
          border-bottom: 0; margin-bottom: 16px; padding-bottom: 0;
          text-align: center;
        }
        .blog-content h2:first-child + ol {
          counter-reset: toc-section; display: flex; flex-direction: column; gap: 14px;
          margin: 18px 0 36px; padding: 20px;
          border: 1px solid #e2e8f0; border-radius: 18px;
          background: #f8fafc; list-style: none;
        }
        .blog-content h2:first-child + ol li {
          background: white; border: 1px solid #edf2f7; border-left: 0;
          box-shadow: 0 8px 22px rgba(14,37,71,0.04);
        }
        .blog-content h2:first-child + ol > li {
          counter-increment: toc-section; display: block;
          position: relative; margin: 0; padding: 16px 16px 16px 58px;
          border-radius: 14px;
        }
        .blog-content h2:first-child + ol > li::before {
          content: counter(toc-section); width: 30px; min-width: 30px; height: 30px;
          display: inline-flex; align-items: center; justify-content: center;
          position: absolute; left: 16px; top: 16px;
          border-radius: 999px; background: #0e2547; color: white;
          font-size: 13px; font-weight: 800; margin-top: 0;
        }
        .blog-content h2:first-child + ol > li > a,
        .blog-content h2:first-child + ol > li > p,
        .blog-content h2:first-child + ol > li > span {
          color: #0e2547; font-weight: 800;
          line-height: 1.55; border-bottom: 0;
        }
        .blog-content h2:first-child + ol ol {
          display: flex; flex-direction: column; gap: 10px;
          margin: 14px 0 0; padding: 0; list-style: none;
        }
        .blog-content h2:first-child + ol ol li {
          display: flex; align-items: flex-start; gap: 12px;
          margin: 0; padding: 12px 14px;
          border-radius: 12px;
        }
        .blog-content h2:first-child + ol ol li::before {
          content: none;
        }
        .blog-content h2:first-child + ol ol a,
        .blog-content h2:first-child + ol ol p,
        .blog-content h2:first-child + ol ol span {
          color: #334155; border-bottom: 0; font-weight: 700; line-height: 1.6;
          margin: 0;
        }
        .blog-content h2:first-child + ol ol span:first-child,
        .blog-content h2:first-child + ol ol strong:first-child {
          flex: 0 0 44px; color: #64748b; font-size: 13px;
        }
        @media (max-width: 640px) {
          .blog-content h2:first-child + ol { padding: 14px; }
          .blog-content h2:first-child + ol > li {
            padding: 14px 14px 14px 52px;
          }
        }
        .blog-content blockquote {
          border-left: 4px solid #e61e73; padding: 16px 22px; margin: 24px 0;
          background: linear-gradient(135deg, #fff5f8 0%, #fff0f5 100%);
          border-radius: 0 12px 12px 0; color: #475569;
          font-size: 17px; line-height: 1.85; font-style: italic;
          box-shadow: 0 4px 14px rgba(230,30,115,0.08);
        }
        .blog-content a { color: #e61e73; text-decoration: none; font-weight: 600; border-bottom: 1px solid rgba(230,30,115,0.3); transition: border-color 0.2s; }
        .blog-content a:hover { border-bottom-color: #e61e73; }
        .blog-content img { max-width: 100%; border-radius: 16px; box-shadow: 0 12px 32px rgba(0,0,0,0.1); margin: 24px auto; display: block; }
        .blog-content hr { border: none; height: 2px; background: linear-gradient(90deg, #e61e73, transparent); margin: 32px 0; border-radius: 2px; }
        .blog-content .ql-align-center { text-align: center; }
        .blog-content .ql-align-right { text-align: right; }
        .blog-content .ql-align-justify { text-align: justify; }
        .img-card { overflow: hidden; border-radius: 20px; box-shadow: 0 12px 36px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .img-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.13); }
        .img-card img { width: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .img-card:hover img { transform: scale(1.03); }
      `}</style>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1180px]">

          <LocalizedClientLink
            href="/blog"
            className={`${outfit.className} inline-flex items-center gap-2 text-[14px] font-semibold text-slate-400 transition-colors hover:text-[#e61e73]`}
          >
            <span className="text-[18px]">←</span> Back to Blog
          </LocalizedClientLink>

          {/* Post header */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              {post.category_id && (
                <span
                  className={`${mansalva.className} inline-flex items-center rounded-full px-4 py-1 text-[14px] text-white`}
                  style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
                >
                  {post.category_id}
                </span>
              )}
              {post.published_at && (
                <span className={`${outfit.className} text-[13px] font-semibold uppercase tracking-[0.05em] text-slate-400`}>
                  {formatDate(post.published_at)}
                </span>
              )}
            </div>

            <h1 className={`${epilogue.className} mt-5 max-w-[820px] text-[32px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#0e2547] sm:text-[42px] lg:text-[54px]`}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p className={`${outfit.className} mt-5 max-w-[700px] text-[17px] leading-[1.85] text-slate-600`}>
                {post.excerpt}
              </p>
            )}

            {post.author_name && (
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="flex h-[46px] w-[46px] items-center justify-center rounded-full shadow-md"
                  style={{ background: "linear-gradient(135deg, #0e2547, #1e4a8a)" }}
                >
                  <span className="text-[18px] font-extrabold text-white">
                    {post.author_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className={`${epilogue.className} text-[15px] font-extrabold text-[#0e2547]`}>{post.author_name}</p>
                  <p className={`${outfit.className} text-[12px] text-slate-400`}>Author · Mommantum</p>
                </div>
              </div>
            )}
          </div>


          {/* Article content — null-safe */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="min-w-0">
          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="h-[4px] w-full" style={{ background: "linear-gradient(90deg, #e61e73, #9333ea, #0ea5e9)" }} />
            <div className="p-7 lg:p-12">
              {/* Featured image moved inside to align with text */}
              {post.featured_image && (
                <div className="mb-10 overflow-hidden rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
                  <div className="relative aspect-[16/9] w-full">
                    <Image src={post.featured_image} alt={post.title} fill className="object-cover" priority />
                  </div>
                </div>
              )}

              {post.content ? (
                <div 
                  className="blog-content" 
                  dangerouslySetInnerHTML={{ 
                    __html: post.content.replace(/\[Featured Image[^\]]*\]/gi, "") 
                  }} 
                />
              ) : (
                <p className={`${outfit.className} text-[16px] text-slate-400 italic`}>Content coming soon.</p>
              )}
            </div>
          </div>

          {/* Extra images */}
          {validImages.length > 0 && (
            <div className="mt-10">
              <p className={`${mansalva.className} mb-6 text-[18px] text-[#e61e73]`}>More from this article</p>
              {validImages.length === 1 && (
                <div className="img-card"><img src={validImages[0]} alt={`${post.title} image 1`} style={{ maxHeight: "520px" }} /></div>
              )}
              {validImages.length === 2 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {validImages.map((img, i) => (
                    <div key={i} className="img-card"><img src={img} alt={`${post.title} image ${i + 1}`} style={{ maxHeight: "400px" }} /></div>
                  ))}
                </div>
              )}
              {validImages.length === 3 && (
                <div className="flex flex-col gap-5">
                  <div className="img-card"><img src={validImages[0]} alt={`${post.title} image 1`} style={{ maxHeight: "480px" }} /></div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {validImages.slice(1).map((img, i) => (
                      <div key={i} className="img-card"><img src={img} alt={`${post.title} image ${i + 2}`} style={{ maxHeight: "340px" }} /></div>
                    ))}
                  </div>
                </div>
              )}
              {validImages.length >= 4 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {validImages.map((img, i) => (
                    <div key={i} className="img-card"><img src={img} alt={`${post.title} image ${i + 1}`} style={{ maxHeight: "360px" }} /></div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom CTA */}
          <div
            className="relative mt-14 overflow-hidden rounded-[24px] p-8 text-center shadow-[0_18px_50px_rgba(14,37,71,0.2)] lg:p-12"
            style={{ background: "linear-gradient(135deg, #0e2547 0%, #1a3a6b 50%, #0e2547 100%)" }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute left-[10%] top-[20%] h-24 w-24 rounded-full bg-[#e61e73]" />
              <div className="absolute right-[15%] bottom-[20%] h-16 w-16 rounded-full bg-[#9333ea]" />
            </div>
            <p className={`${mansalva.className} relative text-[18px] text-[#ef6a99]`}>Want to read more?</p>
            <h3 className={`${epilogue.className} relative mt-3 text-[26px] font-extrabold tracking-[-0.04em] text-white lg:text-[34px]`}>
              Explore all our articles
            </h3>
            <p className={`${outfit.className} relative mt-3 text-[15px] text-white/75`}>
              Strategy, creative, and performance insights — all in one place.
            </p>
            <div className="relative mt-8">
              <LocalizedClientLink
                href="/blog"
                className={`${epilogue.className} inline-flex h-[52px] items-center justify-center rounded-[14px] px-10 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:opacity-90 hover:-translate-y-0.5`}
                style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
              >
                View More Articles ›
              </LocalizedClientLink>
            </div>
          </div>

            </div>

            {popularPosts.length > 0 && (
              <aside className="rounded-[24px] bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] lg:sticky lg:top-24">
                <h2 className={`${epilogue.className} text-[22px] font-extrabold tracking-[-0.04em] text-[#0e2547]`}>
                  Popular articles
                </h2>
                <div className="mt-6 grid gap-5">
                  {popularPosts.map((item, i) => (
                    <LocalizedClientLink
                      key={item.slug}
                      href={`/blog/${item.slug}`}
                      className="group grid grid-cols-[28px_1fr] gap-3"
                    >
                      <span className={`${epilogue.className} pt-0.5 text-[13px] font-extrabold text-[#99dcf8]`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className={`${epilogue.className} block text-[15px] font-extrabold leading-[1.25] tracking-[-0.02em] text-[#0e2547] transition-colors group-hover:text-[#e61e73]`}>
                          {item.title}
                        </span>
                        <span className={`${outfit.className} mt-1.5 block text-[12px] text-slate-400`}>
                          {formatDate(item.published_at)}
                        </span>
                      </span>
                    </LocalizedClientLink>
                  ))}
                </div>
              </aside>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
