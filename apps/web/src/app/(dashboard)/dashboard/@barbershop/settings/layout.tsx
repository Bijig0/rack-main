'use client'
import { FaUser } from 'react-icons/fa'
import { FaWrench } from 'react-icons/fa6'
import SettingsLayout from '../../settings/layout'

type Props = {
  children: React.ReactNode
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <FaUser size={18} />,
    href: '/dashboard/settings/',
  },

  {
    title: 'Account',
    icon: <FaWrench size={18} />,
    href: '/dashboard/settings/account',
  },
]

const Layout = (props: Props) => {
  const { children } = props
  return (
    <>
      <SettingsLayout sidebarNavItems={sidebarNavItems}>
        {children}
      </SettingsLayout>
    </>
  )
}

export default Layout
