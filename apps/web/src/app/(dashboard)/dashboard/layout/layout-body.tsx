import { cn } from '@/utils/tailwind'
import React from 'react'
interface LayoutBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  fixedHeight?: boolean
}

const LayoutBody = React.forwardRef<HTMLDivElement, LayoutBodyProps>(
  ({ className, fixedHeight, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex-1 overflow-hidden px-4 py-6 md:px-8',
        fixedHeight && 'h-[calc(100%-var(--header-height))]',
        className,
      )}
      {...props}
    />
  ),
)
LayoutBody.displayName = 'LayoutBody'

export default LayoutBody
