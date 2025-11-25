import { cn } from '@/utils/tailwind'
import { MdLocationPin } from 'react-icons/md'

type Props = {
  barbershopDisplayName: () => React.ReactNode
  barbershopTagline: () => React.ReactNode
  barbershopStars: () => React.ReactNode
  barbershopInstagram: () => React.ReactNode
  barbershopAddress: () => React.ReactNode

  className?: string
}

const BarbershopPreview = (props: Props) => {
  const {
    className,
    barbershopDisplayName,
    barbershopTagline,
    barbershopStars,
    barbershopInstagram,
    barbershopAddress,
  } = props

  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-start gap-2"></div>
      {barbershopDisplayName()}
      {barbershopTagline()}
      {barbershopStars()}
      {barbershopInstagram()}
      {barbershopAddress()}
    </div>
  )
}

export default BarbershopPreview
