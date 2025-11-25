import { cn } from '@/utils/tailwind'
import React from 'react'

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  fadedBelow?: boolean
  fixedHeight?: boolean
}

const LayoutDashboard = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, fadedBelow = false, fixedHeight = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex h-full w-full flex-col',
        fadedBelow &&
          'after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:hidden after:h-32 after:w-full after:bg-[linear-gradient(180deg,_transparent_10%,_hsl(var(--background))_70%)] after:md:block',
        fixedHeight && 'md:h-svh',
        className,
      )}
      {...props}
    />
  ),
)
LayoutDashboard.displayName = 'LayoutDashboard'

export default LayoutDashboard
