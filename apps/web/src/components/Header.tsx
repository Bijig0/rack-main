import Image from 'next/image'
import Link from 'next/link'
import Logo from '../../public/images/Logo.png'
import HeaderSide from './HeaderSide'
import { MobileSidebar } from './MobileSidebar'

const Header = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-gray-200 shadow-md border-bottom-px dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image src={Logo} alt="logo" className="w-24" />
        </Link>
        <HeaderSide />
      </div>
    </nav>
  )
}

export default Header
