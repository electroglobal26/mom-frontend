"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminServicesList() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((d) => { setServices(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  async function deleteService(slug: string) {
    if (!confirm(`Delete "${slug}"?`)) return
    const res = await fetch(`/api/admin/services/${slug}`, { method: "DELETE" })
    if (res.ok) setServices(services.filter((s) => s.slug !== slug))
    else alert("Failed to delete")
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#0e2547]">Services</h1>
          <p className="mt-1 text-[14px] text-slate-500">{services.length} services</p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-[10px] bg-[#0e2547] px-5 py-2.5 text-[13px] font-bold text-white hover:opacity-90"
        >
          + New Service
        </Link>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400">Loading...</div>
      ) : (
        <div className="mt-6 space-y-3">
          {services.map((service) => (
            <div
              key={service.slug}
              className="flex items-center justify-between rounded-[14px] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
            >
              <div>
                <p className="text-[15px] font-bold text-[#0e2547]">{service.title}</p>
                <p className="mt-0.5 text-[12px] text-slate-400">/{service.slug}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/services/${service.slug}`}
                  className="rounded-[8px] border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-[#0e2547] hover:border-[#0e2547]"
                >
                  Edit
                </Link>
                <Link
                  href={`/services/${service.slug}`}
                  target="_blank"
                  className="rounded-[8px] border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-400 hover:border-slate-400"
                >
                  View ↗
                </Link>
                <button
                  onClick={() => deleteService(service.slug)}
                  className="rounded-[8px] border border-red-100 px-3 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}