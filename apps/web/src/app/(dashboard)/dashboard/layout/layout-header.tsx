import { cn } from '@/utils/tailwind'
import React from 'react'

const LayoutHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-[var(--header-height)] flex-none items-center gap-4 bg-background p-4 md:px-8',
      className,
    )}
    {...props}
  />
))
LayoutHeader.displayName = 'LayoutHeader'

export default LayoutHeader
