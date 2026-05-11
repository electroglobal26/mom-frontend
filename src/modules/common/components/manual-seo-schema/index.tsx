import React from "react"

type ManualSchemaProps = {
  type: "homepage" | "service" | "blog" | "collection" | "normal" | "blog-listing"
  data: any
}

export default function ManualSeoSchema({ type, data }: ManualSchemaProps) {
  let schema: any = null

  const keywords = [
    data.primary_keyword,
    data.secondary_keyword_1,
    data.secondary_keyword_2,
    data.secondary_keyword_3,
    data.secondary_keyword_4
  ].filter(Boolean).join(", ")

  const faqs = data.faq_json_10 || []

  if (type === "homepage") {
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "name": "Mommantum",
          "url": "https://www.mommantum.com/in",
          "logo": "https://www.mommantum.com/_next/image?url=%2Flogo.png&w=48&q=75",
          "telephone": "+91-9588973492",
          "email": "mommantummedia@gmail.com",
          "sameAs": [
            "https://www.instagram.com/mommantummedia?igsh=OXpxZ3Y0aTAxMTk4"
          ],
          "keywords": keywords || "Digital Marketing Agency Jaipur, Growth Strategy, performance marketing",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "India",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "302017",
            "addressCountry": "IN"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "SEO", "item": "https://www.mommantum.com/in/services/search-engine-optimization" },
            { "@type": "ListItem", "position": 2, "name": "E-Commerce", "item": "https://www.mommantum.com/in/services/ecommerce-development" },
            { "@type": "ListItem", "position": 3, "name": "Social Media Marketing", "item": "https://www.mommantum.com/in/services/social-media-marketing" },
            { "@type": "ListItem", "position": 4, "name": "Web Development", "item": "https://www.mommantum.com/in/services/web-design-development" },
            { "@type": "ListItem", "position": 5, "name": "Work", "item": "https://www.mommantum.com/in/work" },
            { "@type": "ListItem", "position": 6, "name": "About Us", "item": "https://www.mommantum.com/in/about" },
            { "@type": "ListItem", "position": 7, "name": "Blogs", "item": "https://www.mommantum.com/in/blog" }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": faqs
        }
      ]
    }
  } else if (type === "service") {
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        // ===== ORGANIZATION =====
        {
          "@type": "Organization",
          "@id": "https://www.mommantum.com/#organization",
          "name": "Mommantum",
          "url": "https://www.mommantum.com/in",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.mommantum.com/logo.png"
          },
          "sameAs": [
            "https://www.instagram.com/mommantummedia?igsh=OXpxZ3Y0aTAxMTk4",
            "https://www.linkedin.com/company/mommantum", // Placeholder if not provided
            "https://www.facebook.com/mommantum"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "sales",
            "telephone": "+91-9588973492",
            "email": "mommantummedia@gmail.com",
            "areaServed": "IN",
            "availableLanguage": ["en", "hi"]
          }
        },

        // ===== SERVICE =====
        {
          "@type": "Service",
          "@id": `${data.service_url}#service`,
          "name": data.service_title,
          "description": data.meta_description,
          "url": data.service_url,
          "image": data.service_image,
          "provider": {
            "@id": "https://www.mommantum.com/#organization"
          },
          "areaServed": {
            "@type": "Country",
            "name": "India"
          },
          "serviceType": data.service_title,
          "keywords": keywords,
          "offers": {
            "@type": "Offer",
            "url": data.service_url,
            "availability": "https://schema.org/InStock"
          }
        },

        // ===== BREADCRUMB =====
        {
          "@type": "BreadcrumbList",
          "@id": `${data.service_url}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.mommantum.com/in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Services",
              "item": "https://www.mommantum.com/in/services"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": data.service_title,
              "item": data.service_url
            }
          ]
        },

        // ===== FAQ =====
        {
          "@type": "FAQPage",
          "@id": `${data.service_url}#faq`,
          "mainEntity": faqs.slice(0, 10).map((f: any) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        },

        // ===== OTHER SERVICES =====
        {
          "@type": "ItemList",
          "@id": `${data.service_url}#services`,
          "name": "Our Services",
          "itemListElement": (data.other_services || []).map((s: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": s.title,
            "url": `https://www.mommantum.com/in/services/${s.slug}`
          }))
        }
      ]
    }
  } else if (type === "blog") {
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        // ===== BLOG POST =====
        {
          "@type": "BlogPosting",
          "@id": `${data.page_url}#blog`,
          "headline": data.title,
          "description": data.meta_description,
          "image": data.featured_image,
          "datePublished": data.published_date,
          "dateModified": data.modified_date || data.published_date,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.page_url
          },
          "inLanguage": "en-IN",
          "articleSection": data.category_name,
          "keywords": keywords // Includes secondary_keyword_5 if provided in keywords helper
        },

        // ===== BREADCRUMB =====
        {
          "@type": "BreadcrumbList",
          "@id": `${data.page_url}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.mommantum.com/in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://www.mommantum.com/in/blog"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": data.category_name,
              "item": `https://www.mommantum.com/in/blog/${data.category_slug}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": data.title,
              "item": data.page_url
            }
          ]
        },

        // ===== FAQ =====
        {
          "@type": "FAQPage",
          "@id": `${data.page_url}#faq`,
          "mainEntity": faqs.slice(0, 10).map((f: any) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        },

        // ===== RECENT POSTS =====
        {
          "@type": "ItemList",
          "@id": `${data.page_url}#recent`,
          "name": "Recent Posts",
          "itemListElement": (data.recent_posts || []).map((post: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": post.url,
            "name": post.title
          }))
        }
      ]
    }
  } else if (type === "collection" || type === "blog-listing") {
    const isBlogListing = type === "blog-listing";
    const baseUrl = isBlogListing ? "https://www.mommantum.com/in/blog" : "https://www.mommantum.com/in/services";
    const name = isBlogListing ? "Blog" : "Services";
    
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        // ===== ORGANIZATION =====
        {
          "@type": "Organization",
          "@id": "https://www.mommantum.com/#organization",
          "name": "Mommantum",
          "url": "https://www.mommantum.com/in",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.mommantum.com/logo.png"
          },
          "sameAs": [
            "https://www.instagram.com/mommantummedia?igsh=OXpxZ3Y0aTAxMTk4",
            "https://www.linkedin.com/company/mommantum",
            "https://www.facebook.com/mommantum"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "sales",
            "telephone": "+91-9588973492",
            "email": "mommantummedia@gmail.com",
            "areaServed": "IN",
            "availableLanguage": ["en", "hi"]
          }
        },

        // ===== COLLECTION PAGE =====
        {
          "@type": isBlogListing ? "Blog" : "CollectionPage",
          "@id": `${baseUrl}#collection`,
          "name": data.category_title || name,
          "url": baseUrl,
          "description": data.meta_description,
          "inLanguage": "en-IN",
          "keywords": keywords
        },

        // ===== BREADCRUMB =====
        {
          "@type": "BreadcrumbList",
          "@id": `${baseUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.mommantum.com/in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": name,
              "item": baseUrl
            }
          ]
        },

        // ===== ALL ITEMS =====
        {
          "@type": "ItemList",
          "@id": `${baseUrl}#list`,
          "name": `All ${name}`,
          "itemListElement": (data.services || data.blog_posts || []).map((item: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": item.title,
            "url": `https://www.mommantum.com/in/${isBlogListing ? 'blog' : 'services'}/${item.slug}`
          }))
        },

        // ===== FAQ =====
        {
          "@type": "FAQPage",
          "@id": `${baseUrl}#faq`,
          "mainEntity": faqs.slice(0, 10).map((f: any) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        }
      ]
    }
  } else if (type === "normal") {
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "name": data.page_title,
          "description": data.meta_description,
          "url": data.page_url,
          "keywords": keywords
        },
        {
          "@type": "FAQPage",
          "mainEntity": faqs
        }
      ]
    }
  }

  if (!schema) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
