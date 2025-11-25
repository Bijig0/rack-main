import MainSiteFooter from '@/app/(main-site)/MainSiteFooter'
import Header from '@/components/Header'
import { Analytics } from '@vercel/analytics/react'

export default function MainSiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Analytics />
      <MainSiteFooter className="bg-gray-100" />
    </>
  )
}
