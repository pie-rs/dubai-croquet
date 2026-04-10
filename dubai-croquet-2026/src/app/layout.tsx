import type { Metadata } from 'next'
import { DM_Mono, Noto_Sans_Display, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const poppins = Poppins({
  variable: '--font-sans',
  weight: ['400', '700'],
  subsets: ['latin'],
})

const dmMono = DM_Mono({
  variable: '--font-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
})

const notoSansDisplay = Noto_Sans_Display({
  variable: '--font-display',
  weight: ['400', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Dubai Croquet Club',
  description: 'Dubai Croquet Club. Croquet, socials, fixtures, and wildly unnecessary elegance.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${dmMono.variable} ${notoSansDisplay.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
