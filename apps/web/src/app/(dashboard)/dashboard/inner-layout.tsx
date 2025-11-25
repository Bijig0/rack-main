'use client'
import { useState } from 'react'
import DashboardProvider from './barbershop-dashboard-context'
import LayoutBody from './layout/layout-body'
import Layout from './layout/layout-dashboard'
import Sidebar from './sidebar'
import { SideLink } from './layout'

type Props = {
  children: React.ReactNode
  sidebarLinks: SideLink[]
}

const InnerLayout = (props: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { children, sidebarLinks } = props
  return (
    <>
      <Sidebar
        sidebarLinks={sidebarLinks}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main
        id="content"
        className={`w-full max-w-6xl overflow-x-hidden transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Layout>
          {/* ===== Top Heading ===== */}
          {/* ===== Main ===== */}
          <LayoutBody className="space-y-4">
            {children}
          </LayoutBody>
        </Layout>
      </main>
    </>
  )
}

export default InnerLayout
