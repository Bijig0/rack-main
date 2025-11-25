import { Toaster } from '@/components/ui/toaster'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import ThemeProvider from '@/providers/ThemeProvider'
import { GoogleAnalytics } from '@next/third-parties/google'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Analytics } from "@vercel/analytics/react"
import { GeistSans } from 'geist/font/sans'
import Script from 'next/script'
import NextTopLoader from 'nextjs-toploader'
import ErrorProvider from './error-context'
import './globals.css'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'TaperAU - Find your next fresh cut',
  description: 'THE platform that connects independent barbers with customers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={GeistSans.className}
      // style={{ colorScheme: 'dark' }}
    >
      <Script
        type="text/javascript"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API}&libraries=places`}
      />
      <GoogleAnalytics gaId="G-7LGD00GVX5" />
      <Analytics/>

      <body className="text-foreground">
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider
          // attribute="class"
          // defaultTheme="dark"
          // enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <ErrorProvider>{children}</ErrorProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
