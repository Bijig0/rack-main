import { cn } from '@/utils/tailwind'

type Props = {
  className?: string
  children?: React.ReactNode
}

const BarbershopDisplayName = (props: Props) => {
  const { className, children } = props
  return (
    <h1
      className={cn('text-2xl font-bold tracking-tight md:text-3xl', className)}
    >
      {children}
    </h1>
  )
}

export default BarbershopDisplayName
