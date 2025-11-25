'use client'
import { FaUser } from 'react-icons/fa'
import { FaClock, FaScissors } from 'react-icons/fa6'
import BookingsLayout from './bookings-layout'

type Props = {
  children: React.ReactNode
}

const sidebarNavItems = [
  {
    title: 'Bookings',
    icon: <FaUser size={18} />,
    href: '/dashboard/bookings/',
  },

  {
    title: 'Services',
    icon: <FaScissors size={18} />,
    href: '/dashboard/bookings/services/',
  },
  {
    title: 'Availability',
    icon: <FaClock size={18} />,
    href: '/dashboard/bookings/availability/',
  },
]

const Layout = (props: Props) => {
  const { children } = props
  return (
    <>
      <BookingsLayout sidebarNavItems={sidebarNavItems}>
        {children}
      </BookingsLayout>
    </>
  )
}

export default Layout
