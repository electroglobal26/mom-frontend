import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const slug = body.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 80)

    const { error } = await supabaseAdmin.from("blog_posts").insert({
      slug,
      title: body.title,
      category: body.category,
      date: body.date || new Date().toLocaleDateString("en-IN", {
        year: "numeric", month: "long", day: "numeric",
      }),
      image: body.image || "",
      excerpt: body.excerpt,
      intro: body.intro,
      sections: body.sections || [],
      published: body.published ?? true,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, slug })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}