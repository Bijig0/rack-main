'use client'
import { Separator } from '@radix-ui/react-separator'
import LayoutBody from '../../layout/layout-body'
import Layout from '../../layout/layout-dashboard'
import SidebarNav from '../../settings/sidebar-nav'

type SidebarNavItem = {
  title: string
  href: string
  icon: JSX.Element
}

export default function BookingsLayout({
  children,
  sidebarNavItems,
}: {
  sidebarNavItems: SidebarNavItem[]
  children: React.ReactNode
}) {
  return (
    <Layout fadedBelow fixedHeight>
      {/* ===== Top Heading ===== */}

      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Booking
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col flex-1 space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="sticky top-0 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="w-full p-1 pr-4 lg:max-w-xl">
            <div className="pb-16">{children}</div>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}
