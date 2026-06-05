import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("slug", params.slug)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json()
    const { error } = await supabaseAdmin
      .from("services")
      .update({
        title: body.title,
        short_label: body.shortLabel,
        description: body.description,
        intro: body.intro,
        image: body.image,
        points: body.points,
        outcomes: body.outcomes,
        why_it_matters: body.whyItMatters,
      })
      .eq("slug", params.slug)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from("services")
      .delete()
      .eq("slug", params.slug)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
