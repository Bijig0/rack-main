import { MobileSidebar } from '@/components/MobileSidebar'
import { cn } from '@/utils/tailwind'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import Logo from '../../../../public/images/Logo.png'
import { Button } from './SidebarButton'
import { SideLink } from './layout'
import Layout from './layout/layout-dashboard'
import Nav from './nav'

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  sidebarLinks: SideLink[]
}

export default function Sidebar2({
  className,
  isCollapsed,
  setIsCollapsed,
  sidebarLinks,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)

  return (
    <aside
      className={cn(
        `md:h-svh left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:fixed md:bottom-0 md:right-auto ${isCollapsed ? 'md:w-14' : 'md:w-64'}`,
        className,
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout>
        {/* Header */}
        {/* <LayoutHeader className="sticky top-0 flex justify-center px-4 py-3 shadow md:px-4 ">
            <div
              className={`flex items-center justify-center ${!isCollapsed ? 'gap-2' : ''}`}
            >
              <div
                className={`flex flex-col items-center justify-center truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
              >
                <Link
                  href="/"
                  className="flex items-center justify-center rtl:space-x-reverse"
                >
                  <Image src={Logo} alt="logo" className="w-24 mx-auto" />
                </Link>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle Navigation"
              aria-controls="sidebar-menu"
              aria-expanded={navOpened}
              onClick={() => setNavOpened((prev) => !prev)}
            >
              {navOpened ? <FaDoorClosed /> : <FaRegMinusSquare />}
            </Button>
          </LayoutHeader> */}

        <nav className="sticky top-0 z-50 bg-white border-gray-200 shadow-md border-bottom-px dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
            <Link
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <Image src={Logo} alt="logo" className="w-24" />
            </Link>
            <MobileSidebar links={sidebarLinks} />
          </div>
        </nav>

        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={cn(
            `h-full flex-1 overflow-auto`,
            navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2',
          )}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidebarLinks}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className="absolute hidden rounded-full -right-5 top-1/2 md:inline-flex"
        >
          <FaChevronLeft
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </Layout>
    </aside>
  )
}
