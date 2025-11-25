import { cn } from '@/utils/tailwind'
import RawInstagramIcon from '../../public/images/RawInstagramIcon.webp'

import Image from 'next/image'

type Props = {
  className?: string
}

const InstagramIcon = (props: Props) => {
  const { className } = props
  return (
    <Image
      src={RawInstagramIcon}
      alt="instagram"
      className={cn('h-4 w-4', className)}
    />
  )
}

export default InstagramIcon
