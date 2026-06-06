import type { ReactNode } from 'react'
import { Providers } from '@/components/Providers'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="[填写 base.dev Verify token]" />
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
