import { cn } from '@/utils/tailwind'
import { MdLocationPin } from 'react-icons/md'

type Props = {
  className?: string
  children?: React.ReactNode
}

const BarbershopPreviewAddress = (props: Props) => {
  const { className, children } = props
  return (
    <div className={cn('flex items-center justify-start gap-1', className)}>
      <MdLocationPin />
      <a className="underline">{children}</a>
    </div>
  )
}

export default BarbershopPreviewAddress
