"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "⊞", exact: true },
  { label: "Blog Posts", href: "/admin/blog", icon: "✍", exact: false },
  { label: "Services", href: "/admin/services", icon: "⚡", exact: false },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin-login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-50 flex h-full w-[220px] flex-col bg-[#0e2547] px-4 py-6">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] bg-[#e61e73]">
            <span className="text-[15px] font-extrabold text-white">M</span>
          </div>
          <div>
            <p className="text-[13px] font-extrabold text-white">Mommantum</p>
            <p className="text-[11px] text-white/40">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold transition-all ${
                  active
                    ? "bg-[#e61e73] text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-[15px]">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div className="border-t border-white/10 pt-4 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-white/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <span>↗</span> View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-white/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <span>⇥</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Page content ── */}
      <main className="ml-[220px] flex-1 min-h-screen p-8 lg:p-10">
        {children}
      </main>
    </div>
  )
}