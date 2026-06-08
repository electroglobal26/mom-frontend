import { NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
      cache: "no-store",
    })

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Backend is alive",
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Backend health check failed",
          status: response.status,
        },
        { status: 502 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to reach backend",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    )
  }
}
