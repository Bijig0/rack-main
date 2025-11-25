'use client'

import { RawBarbershopDetails } from '@/app/(dashboard)/dashboard/@barbershop/page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import AddOnCard from './AddOnCard'

type Props = {
  addOn: RawBarbershopDetails['addon_details'][number]
}

const MobileAddOnCard = (props: Props) => {
  const { addOn } = props

  return (
    <AddOnCard
      addOnMainImage={() => {
        const mainImageURL =
          addOn.addon_details_gallery?.addon_details_gallery_image.at(
            0,
          )?.image_url
        return mainImageURL ? (
          <Avatar>
            <AvatarImage
              className="object-cover w-12 rounded-full"
              src={mainImageURL}
              alt="Featured Haircut"
            />
            <AvatarFallback className="text-gray-400">FC</AvatarFallback>
          </Avatar>
        ) : null
      }}
      addOn={addOn}
      className="w-3/4"
    />
  )
}

export default MobileAddOnCard
