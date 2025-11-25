'use client'

import { RawBarbershopDetails } from '@/app/(dashboard)/dashboard/@barbershop/page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OtherCutCard from './OtherCutCard'

type Props = {
  haircut: RawBarbershopDetails['haircut_details'][number]
}

const MobileOtherCutCard = (props: Props) => {
  const { haircut } = props

  return (
    <OtherCutCard
      cutMainImage={() => {
        const mainImageURL =
          haircut.haircut_details_gallery?.haircut_details_gallery_image.at(
            0,
          )?.image_url
        return mainImageURL ? (
          <Avatar>
            <AvatarImage
              className="w-12 rounded-full object-cover"
              src={mainImageURL}
              alt="Featured Haircut"
            />
            <AvatarFallback className="text-gray-400">FC</AvatarFallback>
          </Avatar>
        ) : null
      }}
      haircut={haircut}
      className="w-3/4"
    />
  )
}

export default MobileOtherCutCard
