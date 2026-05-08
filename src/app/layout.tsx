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
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T375Z2FR');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={bodyFont.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T375Z2FR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <main>{props.children}</main>
      </body>
    </html>
  )
}