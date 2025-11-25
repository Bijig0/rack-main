'use client'

import Urls from '@/app/urls/urls'
import useGetUser from '@/utils/useGetUser'
import Link from 'next/link'
import { MobileSidebar } from './MobileSidebar'
import { Button } from './ui/button'
import { LoadingSpinner } from './ui/spinner'

export type MobileHeaderLink = {
  href: string
  label: string
}

const loggedInUserLinks = [
  {
    href: '/dashboard',
    label: 'Profile',
  },
  {
    href: '/for-businesses',
    label: "I'm a barber brand",
  },
] satisfies MobileHeaderLink[]

const nonLoggedInUserLinks = [
  {
    href: Urls.login,
    label: 'Login',
  },
  {
    href: Urls.signUp,
    label: 'Sign Up',
  },
  {
    href: '/for-businesses',
    label: "I'm a barber brand",
  },
] satisfies MobileHeaderLink[]

const HeaderSide = () => {
  const { data, error, isLoading } = useGetUser()

  const renderHeaderSide = () => {
    if (data!.user === null) {
      return (
        <ul className="flex items-center space-x-4 rounded-lg p-2 font-medium rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:p-4 ">
          <li>
            <Button
              className="roun rounded-full border border-black bg-transparent py-4 text-sm font-bold text-black hover:border-transparent hover:bg-purple-500 hover:text-white"
              asChild
            >
              <Link className="" href="/for-businesses">
                I'm a barber brand
              </Link>
            </Button>
          </li>
          <li className="hidden md:block">
            <Button
              className="rounded-full border border-black bg-transparent py-4 text-sm font-bold text-black hover:border-transparent hover:bg-purple-500 hover:text-white"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
          </li>
          <li className="md:hidden">
            <MobileSidebar links={nonLoggedInUserLinks} />
          </li>
        </ul>
      )
    }
    return (
      <>
        {/* <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center justify-center cursor-pointer">
              <p className="p-3 text-sm bg-purple-200 rounded-full ">BS</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/dashboard">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu> */}
        <div className="">
          <Button
            className="roun rounded-full border border-black bg-transparent py-4 text-sm font-bold text-black hover:border-transparent hover:bg-purple-500 hover:text-white"
            asChild
          >
            <Link href="/dashboard">Profile</Link>
          </Button>
          {/* <li className="md:hidden">
            <MobileSidebar links={loggedInUserLinks} />
          </li> */}
        </div>
      </>
    )
  }

  console.log({ data })

  if (data) {
    return <>{renderHeaderSide()}</>
  }

  if (isLoading) return <LoadingSpinner className="mx-auto h-4 w-4" />

  if (error) throw error
}

export default HeaderSide
