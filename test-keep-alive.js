#!/usr/bin/env node

/**
 * Test script to verify the keep-alive functionality
 * Run: node test-keep-alive.js
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "https://mommentum-backend.onrender.com"

async function testBackendHealth() {
  console.log("🧪 Testing Backend Keep-Alive System\n")
  console.log(`📍 Backend URL: ${BACKEND_URL}\n`)

  for (let i = 1; i <= 3; i++) {
    console.log(`Attempt ${i}/3...`)

    const startTime = Date.now()

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 90000) // 90 second timeout

      const response = await fetch(`${BACKEND_URL}/health`, {
        method: "GET",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const endTime = Date.now()
      const duration = endTime - startTime

      if (response.ok) {
        console.log(`✅ Success! Response time: ${duration}ms`)
        console.log(`   Status: ${response.status} ${response.statusText}`)
        
        if (duration > 10000) {
          console.log(`   ⚠️  This was likely a cold start (backend was sleeping)`)
        }
        console.log("")
      } else {
        console.log(`⚠️  Backend responded with error`)
        console.log(`   Status: ${response.status} ${response.statusText}`)
        console.log(`   Response time: ${duration}ms\n`)
      }
    } catch (error) {
      const endTime = Date.now()
      const duration = endTime - startTime

      if (error.name === "AbortError") {
        console.log(`❌ Request timed out after 90 seconds`)
        console.log(`   Backend might be down or taking too long to wake up\n`)
      } else {
        console.log(`❌ Failed to reach backend`)
        console.log(`   Error: ${error.message}`)
        console.log(`   Time elapsed: ${duration}ms\n`)
      }
    }

    // Wait 5 seconds between attempts
    if (i < 3) {
      console.log("⏳ Waiting 5 seconds before next attempt...\n")
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }

  console.log("✨ Test complete!\n")
  console.log("💡 Tips:")
  console.log("   - If all tests pass, your backend is healthy")
  console.log("   - First request might be slow if backend was sleeping (30-90s)")
  console.log("   - Subsequent requests should be faster (<500ms)")
  console.log("   - The KeepAlive component will ping every 2 minutes\n")
}

testBackendHealth()
