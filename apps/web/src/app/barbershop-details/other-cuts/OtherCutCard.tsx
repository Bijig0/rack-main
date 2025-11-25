'use client'
import { BarbershopDetails } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/tailwind'
import GalleryButton from './GalleryButton'

type Props = {
  cutMainImage: () => React.ReactNode
  className?: string
  haircut: BarbershopDetails['haircut_details'][number]
}

const OtherCutCard = (props: Props) => {
  const { className, haircut, cutMainImage } = props
  console.log({ haircut })
  const haircutDetails = haircut
  if (!haircutDetails) {
    throw new Error('No haircut details found')
  }

  const mainImage =
    haircutDetails.haircut_details_gallery?.haircut_details_gallery_image.at(0)

  const srcs =
    haircutDetails.haircut_details_gallery?.haircut_details_gallery_image.map(
      (image) => image.image_url,
    )

  // return (
  //   <CardContent className="flex items-center justify-between lg:block lg:space-y-4">
  //     <div className="flex items-center gap-4 pt-2">
  // <FeaturedCutAvatar src={cutMainimage} />
  //       <div>
  //         {cutName()}
  //         {cutPrice()}
  //       </div>
  //     </div>
  //     {galleryButton()}
  //   </CardContent>
  // )
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
          {cutMainImage()}
          <div>
            <p className="text-md font-medium">{haircutDetails.name}</p>
            <p className="text-sm text-muted-foreground">
              ${haircutDetails.price} |{' '}
              <GalleryButton srcs={srcs} cutName={haircutDetails.name} />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OtherCutCard
