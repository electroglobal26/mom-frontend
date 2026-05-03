"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!password.trim()) {
      setError("Please enter password")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Wrong password")
      }
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6]">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-[#0e2547]">
            <span className="text-[20px] font-extrabold text-white">M</span>
          </div>
          <div>
            <p className="text-[16px] font-extrabold text-[#0e2547]">Mommantum</p>
            <p className="text-[12px] text-slate-400">Admin Panel</p>
          </div>
        </div>

        <h1 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#0e2547]">
          Welcome back
        </h1>
        <p className="mt-1 text-[14px] text-slate-500">
          Sign in to manage your blog and services
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.05em] text-[#0e2547]">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleLogin()}
              placeholder="Enter your admin password"
              className="h-[52px] w-full rounded-[14px] border border-slate-200 bg-[#f9f9fb] px-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#0e2547] focus:ring-2 focus:ring-[#0e2547]/10"
            />
            {error && (
              <p className="mt-2 flex items-center gap-1.5 text-[13px] text-red-500">
                <span>⚠</span> {error}
              </p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="h-[52px] w-full rounded-[14px] bg-[#0e2547] text-[14px] font-extrabold uppercase tracking-[0.03em] text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </div>

        <p className="mt-6 text-center text-[12px] text-slate-400">
          This panel is for site administrators only.
        </p>
      </div>
    </div>
  )
}