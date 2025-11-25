'use client'
import { BarbershopDetails } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import GalleryButton from '@/components/GalleryButton'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/tailwind'

type Props = {
  className?: string
  addOn: BarbershopDetails['addon_details'][number]
  addOnMainImage: () => React.ReactNode
}

const AddOnCard = (props: Props) => {
  const { className, addOn, addOnMainImage } = props
  console.log({ addOn })
  const addOnDetails = addOn
  if (!addOnDetails) {
    throw new Error('No addOn details found')
  }

  const mainImage =
    addOnDetails.addon_details_gallery?.addon_details_gallery_image.at(0)

  const srcs =
    addOnDetails.addon_details_gallery?.addon_details_gallery_image.map(
      (image) => image.image_url,
    )

  return (
    <Card className={cn('flex-none pb-1', className)}>
      {/* <CardHeader>
        <img
          alt="Product image"
          className="object-cover w-full rounded-md aspect-square"
          src={mainImage?.image_url ?? PLACEHOLDER_IMAGE_URL}
        />
      </CardHeader> */}
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          {addOnMainImage()}
          <div>
            <p className="font-medium text-md">{addOn.name}</p>
            <p className="text-sm text-muted-foreground">
              ${addOn.price} |{' '}
              <GalleryButton
                className="h-auto p-0 text-sm font-normal text-blue-400 bg-transparent cursor-pointer hover:bg-transparent hover:underline"
                srcs={srcs}
                cutName={addOn.name}
                text="Gallery"
              />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AddOnCard
