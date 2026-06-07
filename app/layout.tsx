import type { ReactNode } from 'react'
import { Providers } from '@/components/Providers'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a24ea7195cfa95c11629b7a" />
        <meta
          name="talentapp:project_verification"
          content="162840bcca14ba96e9ba926da7b470cec1d22efdc3629458b21d57077e05618c6122a5983be33da0deafbeaf5117a4b5984cc3de39e2215514b2156c67125497"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0052ff" />
        <meta
          name="description"
          content="Base GM Roll is an onchain GM counter mini app on Base."
        />
        <meta property="og:title" content="Base GM Roll" />
        <meta
          property="og:description"
          content="Say GM onchain and read your count plus the global GM roll."
        />
        <meta property="og:image" content="/og.png" />
        <title>Base GM Roll</title>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
