import { cn } from '@/utils/tailwind'

type Props = {
  children?: React.ReactNode
  className?: string
}

const BarbershopTagline = (props: Props) => {
  const { children, className } = props
  return <p className={cn('w-3/4', className)}>{children}</p>
}

export default BarbershopTagline
