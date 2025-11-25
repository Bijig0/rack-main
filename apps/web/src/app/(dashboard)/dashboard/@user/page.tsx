import { FaWrench } from 'react-icons/fa6'
import SettingsAccount from '../settings/account'
import SettingsLayout from '../settings/layout'

const sidebarNavItems = [
  {
    title: 'Account',
    icon: <FaWrench size={18} />,
    href: '/dashboard/settings/account',
  },
]

const page = () => {
  return (
    <SettingsLayout sidebarNavItems={sidebarNavItems}>
      <SettingsAccount />
    </SettingsLayout>
  )
}

export default page
