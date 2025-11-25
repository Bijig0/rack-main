'use client'
import { LoadingSpinner } from '@/components/ui/spinner'
import useGetUserRole from '@/utils/useGetUserRole'
import { useState } from 'react'
import { IoMdSettings } from 'react-icons/io'
import { MdDashboard } from 'react-icons/md'
import LayoutBody from './layout/layout-body'
import Layout from './layout/layout-dashboard'
import Sidebar from './sidebar'
import { FaCalendar } from 'react-icons/fa6'

type Props = {
  children: React.ReactNode
  barbershop: React.ReactNode
  user: React.ReactNode
}

export interface NavLink {
  label: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

const barbershopSidelinks: SideLink[] = [
  {
    label: 'Profile',
    href: '/dashboard',
    icon: <MdDashboard size={18} />,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings/',
    icon: <IoMdSettings size={18} />,
  },
  {
    label: 'Booking',
    href: '/dashboard/bookings/',
    icon: <FaCalendar size={18} />,
  },
]

const userSideLinks: SideLink[] = [
  {
    label: 'Settings',
    href: '/dashboard/settings/',
    icon: <IoMdSettings size={18} />,
  },
]

// In the future make DashboardLayout an RSC that fetches the user role,
// But i tried it before and it fucked everything up with errors so I'm not doing it rn
const DashboardLayout = (props: Props) => {
  const { children, barbershop, user } = props
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { data: userRole, isLoading, error } = useGetUserRole()

  console.log({ userRole, error, isLoading })

  if (error) throw error
  if (isLoading) return <LoadingSpinner className="w-8 h-8 mx-auto" />

  const sidebarLinks =
    userRole === 'barbershop' ? barbershopSidelinks : userSideLinks
  const toRender = userRole === 'barbershop' ? barbershop : user

  console.log({ userRole })

  return (
    <div className="relative h-full overflow-hidden bg-background">
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
          <LayoutBody className="space-y-4">{toRender}</LayoutBody>
        </Layout>
      </main>
    </div>
  )
}

export default DashboardLayout
