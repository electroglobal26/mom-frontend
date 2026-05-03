import Image from "next/image"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getBlogPost, getBlogPosts } from "@lib/data/blog-posts"
import { Epilogue, Outfit, Mansalva } from "next/font/google"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

export async function generateMetadata(props: {
  params: Promise<{ slug: string; countryCode: string }>
}): Promise<Metadata> {
  const params = await props.params
  const post = await getBlogPost(params.slug)
  if (!post) return {}
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogDetailPage(props: {
  params: Promise<{ slug: string; countryCode: string }>
}) {
  const params = await props.params
  const post = await getBlogPost(params.slug)
  if (!post) return notFound()

  function formatDate(dateStr: string) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const validImages = post.image_urls?.filter(Boolean) || []

  return (
    <main className="relative overflow-hidden bg-[#f3f4f6] pt-14 pb-20 lg:pt-18 lg:pb-24">

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[4%] top-[5%] h-[180px] w-[500px] rounded-full bg-white/50 blur-3xl" />
        <div className="absolute right-[6%] top-[8%] h-[160px] w-[400px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[20%] bottom-[10%] h-[140px] w-[460px] rounded-full bg-white/30 blur-3xl" />
      </div>

      <style>{`
        .blog-content { font-family: inherit; }

        .blog-content h2 {
          font-size: 26px;
          font-weight: 800;
          color: #0e2547;
          letter-spacing: -0.04em;
          margin: 36px 0 14px;
          line-height: 1.1;
          padding-bottom: 10px;
          border-bottom: 2px solid #f1f5f9;
        }
        .blog-content h2:first-child { margin-top: 0; }

        .blog-content h3 {
          font-size: 20px;
          font-weight: 700;
          color: #0e2547;
          margin: 28px 0 10px;
          line-height: 1.2;
        }

        .blog-content h4 {
          font-size: 17px;
          font-weight: 700;
          color: #1e3a5f;
          margin: 20px 0 8px;
        }

        .blog-content p {
          font-size: 16px;
          line-height: 2;
          color: #64748b;
          margin: 14px 0;
        }

        .blog-content strong { font-weight: 700; color: #0e2547; }
        .blog-content em { font-style: italic; }
        .blog-content u { text-decoration: underline; }
        .blog-content s { text-decoration: line-through; color: #94a3b8; }

        .blog-content ul {
          list-style: none;
          padding: 0;
          margin: 20px 0;
        }
        .blog-content ul li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 16px;
          line-height: 1.85;
          color: #64748b;
          margin: 10px 0;
          padding: 10px 14px;
          background: #f8fafc;
          border-radius: 10px;
          border-left: 3px solid #e61e73;
        }
        .blog-content ul li::before {
          content: "";
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e61e73;
          flex-shrink: 0;
          margin-top: 9px;
        }

        .blog-content ol {
          padding-left: 0;
          margin: 20px 0;
          counter-reset: ol-counter;
          list-style: none;
        }
        .blog-content ol li {
          counter-increment: ol-counter;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          font-size: 16px;
          line-height: 1.85;
          color: #64748b;
          margin: 10px 0;
          padding: 10px 14px;
          background: #f8fafc;
          border-radius: 10px;
        }
        .blog-content ol li::before {
          content: counter(ol-counter);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #0e2547;
          color: white;
          font-size: 12px;
          font-weight: 800;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .blog-content blockquote {
          border-left: 4px solid #e61e73;
          padding: 16px 22px;
          margin: 24px 0;
          background: linear-gradient(135deg, #fff5f8 0%, #fff0f5 100%);
          border-radius: 0 12px 12px 0;
          color: #64748b;
          font-size: 17px;
          line-height: 1.85;
          font-style: italic;
          box-shadow: 0 4px 14px rgba(230,30,115,0.08);
        }

        .blog-content a {
          color: #e61e73;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 1px solid rgba(230,30,115,0.3);
          transition: border-color 0.2s;
        }
        .blog-content a:hover { border-bottom-color: #e61e73; }

        .blog-content img {
          max-width: 100%;
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
          margin: 24px auto;
          display: block;
        }

        .blog-content hr {
          border: none;
          height: 2px;
          background: linear-gradient(90deg, #e61e73, transparent);
          margin: 32px 0;
          border-radius: 2px;
        }

        .blog-content .ql-align-center { text-align: center; }
        .blog-content .ql-align-right { text-align: right; }
        .blog-content .ql-align-justify { text-align: justify; }

        .faq-item {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .faq-item:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }

        .img-card {
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 12px 36px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .img-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.13);
        }
        .img-card img {
          width: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .img-card:hover img { transform: scale(1.03); }
      `}</style>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[860px]">

          {/* Back link */}
          <LocalizedClientLink
            href="/blog"
            className={`${outfit.className} inline-flex items-center gap-2 text-[14px] font-semibold text-slate-400 transition-colors hover:text-[#e61e73]`}
          >
            <span className="text-[18px]">←</span> Back to Blog
          </LocalizedClientLink>

          {/* ── Post header ── */}
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
              <p className={`${outfit.className} mt-5 max-w-[700px] text-[17px] leading-[1.85] text-slate-500`}>
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
                  <p className={`${epilogue.className} text-[15px] font-extrabold text-[#0e2547]`}>
                    {post.author_name}
                  </p>
                  <p className={`${outfit.className} text-[12px] text-slate-400`}>
                    Author · Mommantum
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Cover image ── */}
          {post.featured_image && (
            <div className="mt-10 overflow-hidden rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* ── Article content ── */}
          <div className="mt-10 overflow-hidden rounded-[24px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div
              className="h-[4px] w-full"
              style={{ background: "linear-gradient(90deg, #e61e73, #9333ea, #0ea5e9)" }}
            />
            <div className="p-7 lg:p-12">
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {/* ── Extra images ── */}
          {validImages.length > 0 && (
            <div className="mt-10">
              <p className={`${mansalva.className} mb-6 text-[18px] text-[#e61e73]`}>
                More from this article
              </p>

              {/* 1 image — full width */}
              {validImages.length === 1 && (
                <div className="img-card">
                  <img
                    src={validImages[0]}
                    alt={`${post.title} image 1`}
                    style={{ maxHeight: "520px" }}
                  />
                </div>
              )}

              {/* 2 images — side by side */}
              {validImages.length === 2 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {validImages.map((img, i) => (
                    <div key={i} className="img-card">
                      <img
                        src={img}
                        alt={`${post.title} image ${i + 1}`}
                        style={{ maxHeight: "400px" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 3 images — first full width, two below */}
              {validImages.length === 3 && (
                <div className="flex flex-col gap-5">
                  <div className="img-card">
                    <img
                      src={validImages[0]}
                      alt={`${post.title} image 1`}
                      style={{ maxHeight: "480px" }}
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {validImages.slice(1).map((img, i) => (
                      <div key={i} className="img-card">
                        <img
                          src={img}
                          alt={`${post.title} image ${i + 2}`}
                          style={{ maxHeight: "340px" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4+ images — 2 column grid */}
              {validImages.length >= 4 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {validImages.map((img, i) => (
                    <div key={i} className="img-card">
                      <img
                        src={img}
                        alt={`${post.title} image ${i + 1}`}
                        style={{ maxHeight: "360px" }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── FAQs ── */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-14">
              <div className="mb-8">
                <p className={`${mansalva.className} text-[16px] text-[#e61e73]`}>
                  Got questions?
                </p>
                <h2 className={`${epilogue.className} mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-[#0e2547] lg:text-[36px]`}>
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <div
                      className="flex items-start gap-4 p-6"
                      style={{ borderBottom: "1px solid #f8fafc" }}
                    >
                      <div
                        className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white"
                        style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className={`${epilogue.className} text-[17px] font-extrabold leading-[1.3] text-[#0e2547]`}>
                        {faq.question}
                      </h3>
                    </div>
                    <div className="px-6 pb-6 pt-4">
                      <p
                        className={`${outfit.className} text-[15px] leading-[1.9] text-slate-500`}
                        style={{ paddingLeft: "46px" }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Bottom CTA ── */}
          <div
            className="relative mt-14 overflow-hidden rounded-[24px] p-8 text-center shadow-[0_18px_50px_rgba(14,37,71,0.2)] lg:p-12"
            style={{ background: "linear-gradient(135deg, #0e2547 0%, #1a3a6b 50%, #0e2547 100%)" }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute left-[10%] top-[20%] h-24 w-24 rounded-full bg-[#e61e73]" />
              <div className="absolute right-[15%] bottom-[20%] h-16 w-16 rounded-full bg-[#9333ea]" />
            </div>

            <p className={`${mansalva.className} relative text-[18px] text-[#ef6a99]`}>
              Want to read more?
            </p>
            <h3 className={`${epilogue.className} relative mt-3 text-[26px] font-extrabold tracking-[-0.04em] text-white lg:text-[34px]`}>
              Explore all our articles
            </h3>
            <p className={`${outfit.className} relative mt-3 text-[15px] text-white/60`}>
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
      </div>
    </main>
  )
}