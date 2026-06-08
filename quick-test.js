#!/usr/bin/env node

/**
 * Quick test to check if backend is reachable
 * This test has a 90-second timeout to handle cold starts
 */

const https = require('https')

const BACKEND_URL = 'https://mommentum-backend.onrender.com/health'

console.log('🧪 Quick Backend Test')
console.log('📍 Testing:', BACKEND_URL)
console.log('⏳ Please wait... (may take up to 90 seconds for cold start)\n')

const startTime = Date.now()

const req = https.get(BACKEND_URL, (res) => {
  const duration = Date.now() - startTime
  
  console.log(`✅ Backend responded!`)
  console.log(`   Status: ${res.statusCode}`)
  console.log(`   Response time: ${duration}ms`)
  
  if (duration > 10000) {
    console.log(`\n💡 This was a cold start. Next requests should be faster.`)
    console.log(`   The keep-alive system will prevent this in production.`)
  }
})

req.on('error', (error) => {
  const duration = Date.now() - startTime
  console.log(`❌ Failed to reach backend`)
  console.log(`   Error: ${error.message}`)
  console.log(`   Time elapsed: ${duration}ms`)
})

req.setTimeout(90000, () => {
  console.log(`❌ Request timed out after 90 seconds`)
  console.log(`   Backend might be down or experiencing issues`)
  req.destroy()
})
