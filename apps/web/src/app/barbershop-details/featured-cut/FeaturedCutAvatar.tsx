'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Props = {
  src: string
}

const FeaturedCutAvatar = (props: Props) => {
  return (
    <Avatar>
      <AvatarImage
        className="w-12 rounded-full object-cover"
        src={props.src}
        alt="Featured Haircut"
      />
      <AvatarFallback className="text-gray-400">FC</AvatarFallback>
    </Avatar>
  )
}

export default FeaturedCutAvatar
