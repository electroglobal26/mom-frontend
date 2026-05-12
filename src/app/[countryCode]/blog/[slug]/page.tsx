import Image from "next/image"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SeoJsonLd from "@modules/common/components/seo-json-ld"
import ManualSeoSchema from "@modules/common/components/manual-seo-schema"
import { getBlogPost, getBlogPosts } from "@lib/data/blog-posts"
import { buildSeoMetadata, getSeoSetting } from "@lib/data/seo"
import { Epilogue, Outfit, Mansalva } from "next/font/google"
import BlogFaqAccordion from "./_components/BlogFaqAccordion"

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
          page_url: `https://www.mommantum.com/in/blog/${params.slug}`,
          category_name: post.category_id || "Digital Marketing",
          // keyword fields from seoSetting (populated via admin SEO panel)
          primary_keyword: (seoSetting as any)?.primary_keyword || post.category_id || "",
          secondary_keyword_1: (seoSetting as any)?.secondary_keywords?.[0] || "",
          secondary_keyword_2: (seoSetting as any)?.secondary_keywords?.[1] || "",
          secondary_keyword_3: (seoSetting as any)?.secondary_keywords?.[2] || "",
          secondary_keyword_4: (seoSetting as any)?.secondary_keywords?.[3] || "",
          secondary_keyword_5: (seoSetting as any)?.secondary_keywords?.[4] || "",
          // FAQs from post (shown in schema)
          faq_json_10: (post.faqs || []).map((f: any) => ({
            question: f.question,
            answer: f.answer,
          })),
        }}
      />

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[4%] top-[5%] h-[180px] w-[500px] rounded-full bg-white/50 blur-3xl" />
        <div className="absolute right-[6%] top-[8%] h-[160px] w-[400px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[20%] bottom-[10%] h-[140px] w-[460px] rounded-full bg-white/30 blur-3xl" />
      </div>

      <style>{`
        /* ─── Base blog typography ─────────────────────────────────────────── */
        .blog-content { font-family: inherit; }

        .blog-content h2 {
          font-size: 26px; font-weight: 800; color: #0e2547;
          letter-spacing: -0.04em; margin: 40px 0 16px; line-height: 1.1;
          padding-bottom: 10px; border-bottom: 2px solid #f1f5f9;
        }
        .blog-content h3 {
          font-size: 20px; font-weight: 700; color: #0e2547;
          margin: 28px 0 10px; line-height: 1.2;
        }
        .blog-content h4 {
          font-size: 17px; font-weight: 700; color: #1e3a5f;
          margin: 20px 0 8px;
        }
        .blog-content p {
          font-size: 16px; line-height: 2; color: #475569; margin: 14px 0;
        }
        .blog-content strong { font-weight: 700; color: #0e2547; }
        .blog-content em { font-style: italic; }
        .blog-content u { text-decoration: underline; }
        .blog-content s { text-decoration: line-through; color: #94a3b8; }

        /* ─── Unordered list ───────────────────────────────────────────────── */
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

        /* ─── Ordered list ─────────────────────────────────────────────────── */
        .blog-content ol {
          padding-left: 0; margin: 20px 0;
          counter-reset: ol-counter; list-style: none;
        }
        .blog-content ol li {
          counter-increment: ol-counter; display: flex; align-items: flex-start;
          gap: 14px; font-size: 16px; line-height: 1.85; color: #475569;
          margin: 10px 0; padding: 10px 14px;
          background: #f8fafc; border-radius: 10px;
        }
        .blog-content ol li::before {
          content: counter(ol-counter); display: flex; align-items: center;
          justify-content: center; min-width: 26px; height: 26px;
          border-radius: 50%; background: #0e2547; color: white;
          font-size: 12px; font-weight: 800; flex-shrink: 0; margin-top: 2px;
        }

        /* ─── TABLE OF CONTENTS ────────────────────────────────────────────── */
        /*
          Convention: the very first <h2> in the post is labelled
          "Table of Contents" (or similar). The <ol> immediately after it
          becomes the TOC block.
        */
        .blog-content .toc-wrapper {
          margin: 0 0 40px;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(14,37,71,0.06);
        }
        .blog-content .toc-header {
          display: flex; align-items: center; gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #0e2547, #1e4a8a);
          border-bottom: none;
        }
        .blog-content .toc-header-icon {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .blog-content .toc-header-title {
          font-size: 15px; font-weight: 800;
          color: white; letter-spacing: -0.02em;
          text-transform: uppercase; tracking: 0.05em;
        }
        .blog-content .toc-list {
          counter-reset: toc-main;
          list-style: none; padding: 16px 20px 20px; margin: 0;
          display: flex; flex-direction: column; gap: 4px;
          background: transparent;
        }
        .blog-content .toc-list > li {
          list-style: none; margin: 0 0 6px; padding: 0;
          background: none; border: none;
          display: block; width: 100%;
          counter-increment: none;
        }
        .blog-content .toc-list > li::before { content: none !important; }

        .blog-content .toc-item-main {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 10px 14px; border-radius: 12px;
          background: white;
          border: 1px solid #edf2f7;
          box-shadow: 0 2px 8px rgba(14,37,71,0.04);
          text-decoration: none;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .blog-content .toc-item-main:hover {
          border-color: #e61e73;
          box-shadow: 0 4px 16px rgba(230,30,115,0.1);
          transform: translateX(3px);
        }
        .blog-content .toc-num {
          display: flex; align-items: center; justify-content: center;
          min-width: 28px; height: 28px; border-radius: 8px;
          background: linear-gradient(135deg, #0e2547, #1e4a8a);
          color: white; font-size: 12px; font-weight: 800;
          flex-shrink: 0; margin-top: 1px;
        }
        .blog-content .toc-text {
          font-size: 15px; font-weight: 700; color: #0e2547;
          line-height: 1.4; padding-top: 5px;
        }
        /* Sub-items — rendered BELOW the parent heading, indented */
        .blog-content .toc-sub-list {
          list-style: none;
          padding: 4px 0 8px 44px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 100%;
        }
        .blog-content .toc-sub-list li {
          background: none; border: none; margin: 0; padding: 0;
          display: block; width: 100%;
        }
        .blog-content .toc-sub-list li::before { content: none; }
        .blog-content .toc-item-sub {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 12px; border-radius: 8px;
          color: #475569; font-size: 14px; font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .blog-content .toc-item-sub::before {
          content: "";
          width: 5px; height: 5px; border-radius: 50%;
          background: #cbd5e1; flex-shrink: 0;
          transition: background 0.2s ease;
        }
        .blog-content .toc-item-sub:hover {
          background: #f0f4ff; color: #e61e73;
        }
        .blog-content .toc-item-sub:hover::before { background: #e61e73; }
        .blog-content .toc-sub-prefix {
          flex-shrink: 0; min-width: 34px;
          font-size: 11px; font-weight: 700; color: #94a3b8;
          font-variant-numeric: tabular-nums;
        }

        /* ─── FAQ ACCORDION ────────────────────────────────────────────────── */
        /*
          The JS below detects FAQ headings + following content and wraps them.
          These styles power the accordion UI.
        */
        .faq-section-wrapper {
          margin: 40px 0;
        }
        .faq-section-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 26px; font-weight: 800; color: #0e2547;
          letter-spacing: -0.04em; margin-bottom: 20px;
        }
        .faq-section-title-badge {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 3px 12px; border-radius: 999px;
          background: linear-gradient(135deg, #e61e73, #9333ea);
          color: white; font-size: 12px; font-weight: 700;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .faq-accordion {
          display: flex; flex-direction: column; gap: 10px;
        }
        .faq-item {
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          background: white;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(14,37,71,0.04);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .faq-item.open {
          border-color: #e61e73;
          box-shadow: 0 6px 24px rgba(230,30,115,0.1);
        }
        .faq-question {
          width: 100%; display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          padding: 18px 22px; cursor: pointer;
          background: none; border: none; text-align: left;
          font-size: 16px; font-weight: 700; color: #0e2547;
          line-height: 1.4;
          transition: color 0.2s ease;
        }
        .faq-question:hover { color: #e61e73; }
        .faq-item.open .faq-question { color: #e61e73; }
        .faq-icon {
          flex-shrink: 0; width: 28px; height: 28px;
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          background: #f1f5f9;
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .faq-item.open .faq-icon {
          background: linear-gradient(135deg, #e61e73, #9333ea);
          transform: rotate(45deg);
        }
        .faq-icon svg { width: 14px; height: 14px; }
        .faq-item.open .faq-icon svg { stroke: white; }
        .faq-item:not(.open) .faq-icon svg { stroke: #64748b; }
        .faq-answer {
          max-height: 0; overflow: hidden;
          transition: max-height 0.35s ease, padding 0.3s ease;
          padding: 0 22px;
        }
        .faq-item.open .faq-answer {
          max-height: 800px;
          padding: 0 22px 20px;
        }
        .faq-answer-inner {
          font-size: 15px; line-height: 1.85; color: #475569;
          padding-top: 4px;
          border-top: 1px solid #f1f5f9;
          padding-top: 16px;
        }
        .faq-answer-inner p { margin: 8px 0; color: #475569; font-size: 15px; line-height: 1.85; }
        .faq-answer-inner ul, .faq-answer-inner ol { margin: 10px 0; padding-left: 20px; }
        .faq-answer-inner li { margin: 6px 0; }

        /* ─── Misc blog content styles ─────────────────────────────────────── */
        .blog-content blockquote {
          border-left: 4px solid #e61e73; padding: 16px 22px; margin: 24px 0;
          background: linear-gradient(135deg, #fff5f8 0%, #fff0f5 100%);
          border-radius: 0 12px 12px 0; color: #475569;
          font-size: 17px; line-height: 1.85; font-style: italic;
          box-shadow: 0 4px 14px rgba(230,30,115,0.08);
        }
        .blog-content a {
          color: #e61e73; text-decoration: none; font-weight: 600;
          border-bottom: 1px solid rgba(230,30,115,0.3);
          transition: border-color 0.2s;
        }
        .blog-content a:hover { border-bottom-color: #e61e73; }
        .blog-content img {
          max-width: 100%; border-radius: 16px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
          margin: 24px auto; display: block;
        }
        .blog-content hr {
          border: none; height: 2px;
          background: linear-gradient(90deg, #e61e73, transparent);
          margin: 32px 0; border-radius: 2px;
        }
        .blog-content .ql-align-center { text-align: center; }
        .blog-content .ql-align-right { text-align: right; }
        .blog-content .ql-align-justify { text-align: justify; }

        /* ─── Image cards ──────────────────────────────────────────────────── */
        .img-card {
          overflow: hidden; border-radius: 20px;
          box-shadow: 0 12px 36px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .img-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.13);
        }
        .img-card img {
          width: 100%; object-fit: cover; display: block;
          transition: transform 0.5s ease; margin: 0;
          border-radius: 0; box-shadow: none;
        }
        .img-card:hover img { transform: scale(1.03); }

        /* ─── Popular Articles sidebar ─────────────────────────────────────── */
        .popular-sidebar {
          position: sticky;
          top: 96px;
          align-self: flex-start;
        }

        @media (max-width: 1024px) {
          .popular-sidebar { position: static; }
        }
      `}</style>

      {/*
        ── Client-side JS ──────────────────────────────────────────────────────
        Runs after paint to:
          1. Build a proper TOC (wrap the first h2 + following ol).
          2. Convert FAQ sections into accordions.
        Using dangerouslySetInnerHTML on a <script> tag is the correct Next.js
        pattern for inline scripts in Server Components.
      */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          function init() {
            var content = document.querySelector('.blog-content');
            if (!content) return;

            /* ================================================================
               1. TABLE OF CONTENTS
               ================================================================
               The CMS renders the TOC as a FLAT <ol> where every entry is a
               top-level <li>.  Sub-headings are distinguished by a numeric
               prefix like "1.1", "2.3" etc. at the START of the text.

               Strategy:
               • Find the h2 whose text is "Table of Contents" (or similar).
               • Grab the immediately following <ol>.
               • Walk every <li>:
                   – If text starts with /^\\d+\\.\\d+/ → it is a sub-item.
                   – Otherwise                          → it is a main item.
               • Re-build a clean two-level structure.
            ================================================================ */
            var allH2s = Array.from(content.querySelectorAll('h2'));
            var tocH2 = null;
            for (var i = 0; i < allH2s.length; i++) {
              var t = allH2s[i].textContent.trim().toLowerCase();
              if (t === 'table of contents' || t === 'contents' || t === 'toc' ||
                  t.includes('table of contents')) {
                tocH2 = allH2s[i]; break;
              }
            }

            if (tocH2) {
              var nextEl = tocH2.nextElementSibling;
              /* Also accept <ul> in case the CMS uses that */
              if (nextEl && (nextEl.tagName === 'OL' || nextEl.tagName === 'UL')) {
                var rawOl = nextEl;

                /* ── Parse flat list into { main, subs[] } groups ── */
                var SUB_RE = /^(\\d+\\.\\d+)\\s*/;   /* matches "1.1 ", "2.3 " etc. */
                var groups = [];   /* [{label, text, href, subs:[{prefix,text,href}]}] */
                var mainCounter = 0;

                Array.from(rawOl.querySelectorAll(':scope > li')).forEach(function(li) {
                  var rawText = li.textContent.trim();
                  var anchor  = li.querySelector('a');
                  var href    = anchor ? anchor.getAttribute('href') : null;

                  if (SUB_RE.test(rawText)) {
                    /* Sub-item – attach to last group */
                    var prefix = rawText.match(SUB_RE)[1];
                    var label  = rawText.replace(SUB_RE, '').trim();
                    if (groups.length) {
                      groups[groups.length - 1].subs.push({ prefix: prefix, text: label, href: href });
                    }
                  } else {
                    /* Main item – strip leading "N " counter if present */
                    mainCounter++;
                    var cleanText = rawText.replace(/^\\d+\\.?\\s*/, '').trim() || rawText;
                    groups.push({ num: mainCounter, text: cleanText, href: href, subs: [] });
                  }
                });

                /* ── Build the new TOC DOM ── */
                var wrapper = document.createElement('div');
                wrapper.className = 'toc-wrapper';

                var header = document.createElement('div');
                header.className = 'toc-header';
                header.innerHTML = '<div class="toc-header-icon">📋</div><span class="toc-header-title">Table of Contents</span>';
                wrapper.appendChild(header);

                var newList = document.createElement('ol');
                newList.className = 'toc-list';

                groups.forEach(function(g) {
                  var li = document.createElement('li');

                  /* Main entry */
                  var mainEl = document.createElement(g.href ? 'a' : 'div');
                  mainEl.className = 'toc-item-main';
                  if (g.href) mainEl.setAttribute('href', g.href);
                  mainEl.innerHTML =
                    '<span class="toc-num">' + g.num + '</span>' +
                    '<span class="toc-text">' + escHtml(g.text) + '</span>';
                  li.appendChild(mainEl);

                  /* Sub-entries */
                  if (g.subs.length) {
                    var subUl = document.createElement('ul');
                    subUl.className = 'toc-sub-list';
                    g.subs.forEach(function(s) {
                      var subLi = document.createElement('li');
                      var subEl = document.createElement(s.href ? 'a' : 'span');
                      subEl.className = 'toc-item-sub';
                      if (s.href) subEl.setAttribute('href', s.href);
                      subEl.innerHTML =
                        '<span class="toc-sub-prefix">' + escHtml(s.prefix) + '</span>' +
                        '<span>' + escHtml(s.text) + '</span>';
                      subLi.appendChild(subEl);
                      subUl.appendChild(subLi);
                    });
                    li.appendChild(subUl);
                  }

                  newList.appendChild(li);
                });

                wrapper.appendChild(newList);

                /* Swap in */
                rawOl.parentNode.insertBefore(wrapper, tocH2);
                tocH2.remove();
                rawOl.remove();
              }
            }

            /* ================================================================
               2. FAQ ACCORDION — handled by BlogFaqAccordion client component.
                  Nothing to do here.
            ================================================================ */
          }

          /* tiny HTML-escape helper used in TOC builder */
          function escHtml(str) {
            return str
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          }

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
          } else {
            init();
          }
        })();
      ` }} />

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
          </div>

          {/* ── Two-column layout: article + sidebar ── */}
          <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8">

            {/* ── Main article column ── */}
            <div className="min-w-0">
              <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                <div className="h-[4px] w-full" style={{ background: "linear-gradient(90deg, #e61e73, #9333ea, #0ea5e9)" }} />
                <div className="p-7 lg:p-12">

                  {/* Featured image */}
                  {post.featured_image && (
                    <div className="mb-10 overflow-hidden rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
                      <div className="relative aspect-[16/9] w-full">
                        <Image src={post.featured_image} alt={post.title} fill className="object-cover" priority />
                      </div>
                    </div>
                  )}

                  {/* Blog content — strip FAQ sections; those are rendered below from post.faqs */}
                  {post.content ? (
                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{
                        __html: post.content
                          .replace(/\[Featured Image[^\]]*\]/gi, "")
                          .replace(/<p[^>]*>(?:(?!<\/p>)[\s\S])*?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}(?:(?!<\/p>)[\s\S])*?min read(?:(?!<\/p>)[\s\S])*?<\/p>/gi, "")
                          // Strip any inline FAQ section (h2 containing faq/frequently asked + everything until next h2 or end)
                          .replace(/<h2[^>]*>(?:(?!<\/h2>)[\s\S])*?(?:faq|frequently asked|common questions|questions and answers|q&amp;a|questions &amp; answers)(?:(?!<\/h2>)[\s\S])*?<\/h2>(?:(?!<h2)[\s\S])*?(?=<h2|$)/gi, "")
                      }}
                    />
                  ) : (
                    <p className={`${outfit.className} text-[16px] text-slate-400 italic`}>Content coming soon.</p>
                  )}

                  {/* ── FAQ Accordion — client component, always from post.faqs ── */}
                  <BlogFaqAccordion faqs={post.faqs || []} />

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

            {/* ── Sidebar: Popular Articles ── */}
            {popularPosts.length > 0 && (
              <aside className="popular-sidebar mt-10 lg:mt-0">
                {/* Popular Articles card */}
                <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                  {/* Gradient top bar */}
                  <div className="h-[4px] w-full" style={{ background: "linear-gradient(90deg, #e61e73, #9333ea)" }} />

                  <div className="p-6">
                    <div className="mb-6 flex items-center gap-3">
                      <div
                        className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px]"
                        style={{ background: "linear-gradient(135deg, #0e2547, #1e4a8a)" }}
                      >
                        <span className="text-[16px]">🔥</span>
                      </div>
                      <h2 className={`${epilogue.className} text-[20px] font-extrabold tracking-[-0.03em] text-[#0e2547]`}>
                        Popular Articles
                      </h2>
                    </div>

                    <div className="flex flex-col gap-1">
                      {popularPosts.map((item, i) => (
                        <LocalizedClientLink
                          key={item.slug}
                          href={`/blog/${item.slug}`}
                          className="group relative flex items-start gap-4 rounded-[14px] p-3 transition-all hover:bg-[#f8faff]"
                        >
                          {/* Number badge */}
                          <span
                            className={`${epilogue.className} mt-[3px] flex h-[28px] w-[28px] flex-shrink-0 items-center justify-center rounded-[8px] text-[12px] font-extrabold text-white`}
                            style={{
                              background: i === 0
                                ? "linear-gradient(135deg, #e61e73, #9333ea)"
                                : i === 1
                                ? "linear-gradient(135deg, #f97316, #e61e73)"
                                : "linear-gradient(135deg, #0e2547, #1e4a8a)"
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className={`${epilogue.className} block text-[14px] font-extrabold leading-[1.3] tracking-[-0.02em] text-[#0e2547] transition-colors group-hover:text-[#e61e73] line-clamp-2`}>
                              {item.title}
                            </span>
                            {item.published_at && (
                              <span className={`${outfit.className} mt-1.5 block text-[11px] text-slate-400`}>
                                {formatDate(item.published_at)}
                              </span>
                            )}
                          </span>

                          {/* Hover arrow */}
                          <span className="mt-[5px] flex-shrink-0 text-[#e61e73] opacity-0 transition-opacity group-hover:opacity-100 text-[14px]">
                            →
                          </span>
                        </LocalizedClientLink>
                      ))}
                    </div>

                    {/* View all link */}
                    <div className="mt-5 pt-5 border-t border-slate-100">
                      <LocalizedClientLink
                        href="/blog"
                        className={`${epilogue.className} flex w-full items-center justify-center gap-2 rounded-[12px] py-3 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:opacity-90 hover:-translate-y-0.5`}
                        style={{ background: "linear-gradient(135deg, #0e2547, #1e4a8a)" }}
                      >
                        View All Articles
                        <span className="text-[16px]">→</span>
                      </LocalizedClientLink>
                    </div>
                  </div>
                </div>
              </aside>
            )}

          </div>

        </div>
      </div>
    </main>
  )
}