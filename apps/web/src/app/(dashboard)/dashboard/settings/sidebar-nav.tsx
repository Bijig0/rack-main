'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/tailwind'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { buttonVariants } from '../SidebarButton'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: JSX.Element
  }[]
}

export default function SidebarNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const pathname = undefined
  const router = useRouter()
  const [val, setVal] = useState(pathname ?? '/dashboard/settings')

  const handleSelect = (e: string) => {
    setVal(e)
    router.push(e)
  }

  return (
    <>
      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => {
              return (
                <Link href={item.href} key={item.href}>
                  <SelectItem value={item.href}>
                    <div className="flex px-2 py-1 gap-x-4">
                      <span className="scale-125">{item.icon}</span>
                      <span className="text-md">{item.title}</span>
                    </div>
                  </SelectItem>
                </Link>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden w-full px-1 py-2 overflow-x-auto bg-background md:block">
        <nav
          className={cn(
            'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
            className,
          )}
          {...props}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                pathname === item.href
                  ? 'bg-muted hover:bg-muted'
                  : 'hover:bg-transparent hover:underline',
                'justify-start',
              )}
            >
              <span className="mr-2">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
