"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Section = { heading: string; body: string }

type Props = {
  initialData?: any
  isEdit?: boolean
}

export default function BlogEditor({ initialData, isEdit = false }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState("")

  const [form, setForm] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    date: initialData?.date || "",
    image: initialData?.image || "",
    excerpt: initialData?.excerpt || "",
    intro: initialData?.intro || "",
    published: initialData?.published ?? true,
  })

  const [sections, setSections] = useState<Section[]>(
    initialData?.sections?.length
      ? initialData.sections
      : [{ heading: "", body: "" }]
  )

  function updateForm(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateSection(index: number, key: keyof Section, value: string) {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: value } : s))
    )
  }

  function addSection() {
    setSections((prev) => [...prev, { heading: "", body: "" }])
  }

  function removeSection(index: number) {
    if (sections.length === 1) return
    setSections((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!form.title.trim()) {
      alert("Title is required")
      return
    }
    if (!form.category) {
      alert("Please select a category")
      return
    }
    if (!form.excerpt.trim()) {
      alert("Excerpt is required")
      return
    }
    if (!form.intro.trim()) {
      alert("Intro paragraph is required")
      return
    }

    setSaving(true)
    setSavedMsg("")

    const payload = { ...form, sections }
    const url = isEdit
      ? `/api/admin/blog/${initialData.slug}`
      : "/api/admin/blog"
    const method = isEdit ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        setSavedMsg(isEdit ? "Changes saved!" : "Post created!")
        setTimeout(() => setSavedMsg(""), 3000)
        if (!isEdit && data.slug) {
          router.push(`/admin/blog/${data.slug}`)
        }
      } else {
        alert("Error: " + (data.error?.message || JSON.stringify(data.error)))
      }
    } catch (err) {
      alert("Network error. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full rounded-[12px] border border-slate-200 bg-[#f9f9fb] px-4 py-3 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#99dcf8] focus:ring-2 focus:ring-[#99dcf8]/20"
  const labelClass =
    "mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-[#0e2547]"

  return (
    <div className="mx-auto max-w-[900px]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#0e2547]">
            {isEdit ? "Edit Post" : "New Blog Post"}
          </h1>
          {isEdit && (
            <p className="mt-0.5 text-[12px] text-slate-400">
              slug: /{initialData?.slug}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="text-[13px] font-semibold text-green-500">
              ✓ {savedMsg}
            </span>
          )}
          <button
            onClick={() => router.push("/admin/blog")}
            className="rounded-[10px] border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-500 hover:border-slate-400"
          >
            ← Back
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-[10px] bg-[#e61e73] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#ca155f] disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Post"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-6">

        {/* ── Basic Info ── */}
        <div className="rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
          <h2 className="mb-5 text-[15px] font-extrabold text-[#0e2547]">
            Basic Info
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="Enter post title..."
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  <option>Performance</option>
                  <option>Creative</option>
                  <option>Strategy</option>
                  <option>SEO</option>
                  <option>Branding</option>
                  <option>Social Media</option>
                  <option>D2C Growth</option>
                  <option>Meta Ads</option>
                  <option>Google Ads</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => updateForm("date", e.target.value)}
                  placeholder="e.g. April 10, 2025"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Cover Image Path</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => updateForm("image", e.target.value)}
                placeholder="/blog/post-1.webp"
                className={inputClass}
              />
              <p className="mt-1 text-[12px] text-slate-400">
                Upload image to <code>/public/blog/</code> folder, then type path here e.g.{" "}
                <code>/blog/my-image.webp</code>
              </p>
            </div>

            <div>
              <label className={labelClass}>Excerpt * (shown on blog listing)</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => updateForm("excerpt", e.target.value)}
                placeholder="1-2 sentences describing the post..."
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
          <h2 className="mb-5 text-[15px] font-extrabold text-[#0e2547]">
            Article Content
          </h2>

          <div>
            <label className={labelClass}>Intro Paragraph *</label>
            <textarea
              value={form.intro}
              onChange={(e) => updateForm("intro", e.target.value)}
              placeholder="Opening paragraph of the article..."
              rows={4}
              className={inputClass}
            />
          </div>

          {/* Sections */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[14px] font-bold text-[#0e2547]">
                Sections ({sections.length})
              </p>
              <button
                onClick={addSection}
                className="rounded-[8px] border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-[#0e2547] hover:border-[#0e2547]"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((section, i) => (
                <div
                  key={i}
                  className="rounded-[14px] border border-slate-100 bg-[#fafafa] p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold uppercase tracking-[0.05em] text-slate-400">
                      Section {i + 1}
                    </span>
                    {sections.length > 1 && (
                      <button
                        onClick={() => removeSection(i)}
                        className="text-[12px] font-semibold text-red-400 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>Heading</label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => updateSection(i, "heading", e.target.value)}
                        placeholder="Section heading..."
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Body</label>
                      <textarea
                        value={section.body}
                        onChange={(e) => updateSection(i, "body", e.target.value)}
                        placeholder="Section content..."
                        rows={5}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Publish Settings ── */}
        <div className="rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
          <h2 className="mb-4 text-[15px] font-extrabold text-[#0e2547]">
            Publish Settings
          </h2>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => updateForm("published", e.target.checked)}
              className="h-4 w-4 rounded accent-[#e61e73]"
            />
            <div>
              <span className="text-[14px] font-semibold text-slate-700">
                Published
              </span>
              <p className="text-[12px] text-slate-400">
                {form.published
                  ? "Visible on the live site"
                  : "Hidden — saved as draft only"}
              </p>
            </div>
          </label>
        </div>

        {/* ── Bottom Save ── */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            onClick={() => router.push("/admin/blog")}
            className="rounded-[10px] border border-slate-200 px-5 py-2.5 text-[13px] font-semibold text-slate-500 hover:border-slate-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-[10px] bg-[#e61e73] px-7 py-2.5 text-[13px] font-bold text-white hover:bg-[#ca155f] disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Post"}
          </button>
        </div>

      </div>
    </div>
  )
}