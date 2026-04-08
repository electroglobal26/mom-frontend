// @lib/data/blog-posts.ts

export type BlogPost = {
  slug: string
  title: string
  category: string
  date: string
  image: string
  excerpt: string
  readTime: string
  content: {
    intro: string
    sections: {
      heading: string
      body: string
    }[]
  }
}

export const blogPosts: BlogPost[] = [
  {
    slug: "creative-systems-for-d2c-brands",
    title: "Creative Systems for D2C Brands That Actually Scale",
    category: "Strategy",
    date: "March 15, 2025",
    readTime: "5 min read",
    image: "/blog/post-1.webp",
    excerpt:
      "Most D2C brands treat creative as a one-off task. The ones that scale treat it as a system. Here's how to build one.",
    content: {
      intro:
        "Creative is not a campaign. It's a system. The brands that grow consistently are the ones that produce, test, and iterate content at a pace that compounds — not the ones that go viral once and disappear.",
      sections: [
        {
          heading: "Why One-Off Creative Fails",
          body: "When creative is disconnected from strategy, it produces noise. You get beautiful content that doesn't convert, or ads that perform once but can't be scaled. The fix is building a repeatable production system tied to real performance signals.",
        },
        {
          heading: "The 3-Layer Creative System",
          body: "Layer one is awareness content — broad hooks, emotion-led storytelling. Layer two is consideration content — product demos, social proof, comparisons. Layer three is conversion — urgency, offer clarity, trust signals. Most brands only have layer three.",
        },
        {
          heading: "How to Start Building Yours",
          body: "Start with a content audit. Map what you have against the three layers. Identify the biggest gap and fill it first. Build templates so your team can produce at speed. Then test, measure, and iterate every 30 days.",
        },
      ],
    },
  },
  {
    slug: "performance-marketing-mistakes",
    title: "5 Performance Marketing Mistakes D2C Brands Keep Making",
    category: "Performance",
    date: "March 8, 2025",
    readTime: "4 min read",
    image: "/blog/post-2.webp",
    excerpt:
      "Running ads without a system is just burning money. Here are the five mistakes we see most often — and how to fix them.",
    content: {
      intro:
        "Performance marketing is not just about spending more on ads. It's about building a system where every rupee spent has a clear job to do. Most brands skip the system and wonder why their ROAS keeps dropping.",
      sections: [
        {
          heading: "Mistake 1: No Funnel Clarity",
          body: "Running the same ad to cold and warm audiences is one of the most common mistakes. Cold audiences need awareness. Warm audiences need proof. Hot audiences need a reason to act now. Segment your funnel first.",
        },
        {
          heading: "Mistake 2: Ignoring Creative Fatigue",
          body: "Ads decay fast. If you're running the same three creatives for more than three weeks, you're almost certainly leaving money on the table. Build a creative refresh calendar into your system.",
        },
        {
          heading: "Mistake 3: Optimising for the Wrong Metric",
          body: "Clicks feel good. Purchases pay bills. Make sure your campaign objective, bidding strategy, and success metric are all aligned to the outcome that actually matters to your business.",
        },
      ],
    },
  },
  {
    slug: "seo-strategy-for-organic-growth",
    title: "SEO Strategy That Builds Long-Term Organic Growth",
    category: "SEO",
    date: "February 28, 2025",
    readTime: "6 min read",
    image: "/blog/post-3.webp",
    excerpt:
      "Paid traffic stops the moment you stop paying. Here's how to build an SEO foundation that keeps working for years.",
    content: {
      intro:
        "SEO is the most underinvested channel for most D2C brands. Everyone chases paid performance, but organic traffic compounds over time and delivers the lowest CAC of any channel when done right.",
      sections: [
        {
          heading: "Start With Keyword Intent",
          body: "Not all keywords are equal. Informational keywords build awareness. Commercial keywords signal purchase intent. Transactional keywords are ready to convert. Build content mapped to each stage rather than chasing volume alone.",
        },
        {
          heading: "Content Depth Beats Content Volume",
          body: "Publishing 50 thin blog posts will not outperform 10 deeply researched, genuinely useful articles. Google rewards depth, topical authority, and content that answers real questions better than anything else.",
        },
        {
          heading: "Technical SEO Is the Foundation",
          body: "Fast page load, clean site structure, proper internal linking, and mobile optimisation are table stakes. Before investing in content, make sure your technical foundation is solid.",
        },
      ],
    },
  },
  {
    slug: "brand-identity-beyond-logo",
    title: "Brand Identity Is More Than a Logo — Here's What It Really Means",
    category: "Branding",
    date: "February 20, 2025",
    readTime: "5 min read",
    image: "/blog/post-4.webp",
    excerpt:
      "A logo is the start of a brand, not the end. The brands people remember have systems — not just symbols.",
    content: {
      intro:
        "Brand identity is the sum of every touchpoint your customer experiences. The way you write, the colours you use, the tone of your emails, the feel of your packaging — all of it shapes perception more than your logo ever will.",
      sections: [
        {
          heading: "The 5 Elements of a Strong Brand System",
          body: "Visual language (colour, type, imagery), verbal identity (tone, vocabulary, messaging), brand story (why you exist), positioning (how you differ), and consistency across channels. Most brands have two or three. Strong brands have all five.",
        },
        {
          heading: "Why Consistency Is the Real Moat",
          body: "Consistency builds recognition. Recognition builds trust. Trust reduces the friction between seeing and buying. The brands that feel premium are almost always just the ones that show up consistently, not necessarily the ones with the biggest budgets.",
        },
        {
          heading: "How to Audit Your Brand Identity",
          body: "Screenshot 20 touchpoints — ads, website, packaging, social posts, emails. Lay them side by side. If they don't feel like they come from the same place, you have an inconsistency problem that no new logo will solve.",
        },
      ],
    },
  },
  {
    slug: "ugc-content-strategy",
    title: "How to Build a UGC Content Strategy That Converts",
    category: "Creative",
    date: "February 12, 2025",
    readTime: "4 min read",
    image: "/blog/post-5.webp",
    excerpt:
      "User-generated content is the most trusted form of marketing. Here's how to build a system that produces it consistently.",
    content: {
      intro:
        "UGC outperforms branded creative in almost every performance test. It's more trusted, more relatable, and cheaper to produce. But most brands treat it as an afterthought rather than a core part of their creative strategy.",
      sections: [
        {
          heading: "What Makes UGC Actually Work",
          body: "The best UGC feels real because it is real. Overly scripted or heavily edited UGC loses the authenticity that makes it work in the first place. Give creators a brief, not a script.",
        },
        {
          heading: "Building a Creator Pipeline",
          body: "You don't need macro-influencers. Micro-creators with 5k–50k followers in your niche will outperform celebrity endorsements for most D2C categories. Build relationships, not transactions.",
        },
        {
          heading: "How to Repurpose UGC Across Channels",
          body: "A single UGC video can become a paid ad, an organic reel, a website testimonial, an email asset, and a retargeting creative. Build a repurposing workflow so every piece of content works as hard as possible.",
        },
      ],
    },
  },
  {
    slug: "retention-marketing-guide",
    title: "Retention Marketing: The Growth Lever Most Brands Ignore",
    category: "Growth",
    date: "February 5, 2025",
    readTime: "5 min read",
    image: "/blog/post-6.webp",
    excerpt:
      "Acquiring a customer costs 5x more than keeping one. Here's how to build a retention system that compounds.",
    content: {
      intro:
        "Most D2C brands are obsessed with acquisition. New customers, new ads, new campaigns. But the brands with the best unit economics have cracked retention — and that's where the real margin lives.",
      sections: [
        {
          heading: "The Retention Stack",
          body: "Email, SMS, WhatsApp, push notifications, loyalty programmes, and subscription models are the core tools. You don't need all of them. You need the right two or three, executed consistently.",
        },
        {
          heading: "Segmentation Is Everything",
          body: "Sending the same message to a first-time buyer and a customer who's bought six times is a missed opportunity. Segment by purchase history, category affinity, and recency. Personalisation at this level is not complicated — it's just disciplined.",
        },
        {
          heading: "Measuring Retention Properly",
          body: "Track repeat purchase rate, customer lifetime value, and churn rate by cohort. If you're only looking at monthly revenue, you're missing the story. Cohort analysis will tell you exactly where customers drop off — and that's where you intervene.",
        },
      ],
    },
  },
]