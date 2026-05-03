import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import Script from "next/script"

const logoFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const bodyFont = DM_Sans({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Mommantum | Digital Marketing Agency Jaipur",
  description:
    "Mommantum is a Jaipur-based digital marketing agency helping D2C and B2B brands grow with strategy, creative systems, SEO, and performance marketing.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* GA4 — replace G-XXXXXXXXXX with your actual GA4 ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={bodyFont.className}>
        <main>{props.children}</main>
      </body>
    </html>
  )
}