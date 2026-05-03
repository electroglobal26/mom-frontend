import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "in"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
    return new Map()
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: { "x-publishable-api-key": PUBLISHABLE_API_KEY },
        cache: "no-store",
      })

      const json = await response.json()
      if (!response.ok || !json.regions?.length) return new Map()

      json.regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })

      regionMapCache.regionMapUpdated = Date.now()
    } catch {
      return new Map()
    }
  }

  return regionMapCache.regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion>
) {
  const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

  if (urlCountryCode && regionMap.has(urlCountryCode)) return urlCountryCode
  if (regionMap.has(DEFAULT_REGION)) return DEFAULT_REGION
  if (regionMap.keys().next().value) return regionMap.keys().next().value

  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const adminSecret = process.env.ADMIN_SECRET
  const adminCookie = request.cookies.get("admin_auth")?.value

  // ── 1. STATIC FILES — always pass through immediately ──
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") 
  ) {
    return NextResponse.next()
  }

  // ── 2. /admin-login — handle separately, no Medusa logic ──
  if (pathname === "/admin-login") {
    // Already logged in → go to dashboard
    if (adminCookie && adminCookie === adminSecret) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    // Not logged in → show login page
    return NextResponse.next()
  }

  // ── 3. /admin/* routes — check cookie, no Medusa logic ──
  if (pathname.startsWith("/admin")) {
    // Not logged in → go to login
    if (!adminCookie || adminCookie !== adminSecret) {
      return NextResponse.redirect(new URL("/admin-login", request.url))
    }
    // Logged in → show admin page
    return NextResponse.next()
  }

  // ── 4. MEDUSA REGION LOGIC — only for storefront pages ──
  const regionMap = await getRegionMap()

  if (!regionMap || regionMap.size === 0) {
    return NextResponse.next()
  }

  const countryCode = await getCountryCode(request, regionMap)

  const urlHasCountryCode =
    countryCode && pathname.split("/")[1]?.includes(countryCode)

  if (urlHasCountryCode) {
    return NextResponse.next()
  }

  const redirectPath = pathname === "/" ? "" : pathname
  const queryString = request.nextUrl.search || ""

  if (countryCode) {
    const redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    return NextResponse.redirect(redirectUrl, 307)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|assets).*)",
  ],
}