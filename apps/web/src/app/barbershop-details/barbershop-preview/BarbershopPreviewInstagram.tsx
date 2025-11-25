import InstagramIcon from '@/components/InstagramIcon'
import { cn } from '@/utils/tailwind'

type Props = {
  className?: string
  children: React.ReactNode
}

const BarbershopPreviewInstagram = (props: Props) => {
  const { className, children } = props
  return (
    <div className={cn('flex items-center justify-start gap-1', className)}>
      <InstagramIcon className="w-4 h-4" />
      {children}
    </div>
  )
}

export default BarbershopPreviewInstagram
