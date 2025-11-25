import { RawBarbershopDetails } from '@/app/(dashboard)/dashboard/@barbershop/page'

type NonNullableHaircutDetailsGallery = NonNullable<
  RawBarbershopDetails['haircut_details'][number]['haircut_details_gallery']
>
type HaircutDetail = Omit<
  RawBarbershopDetails['haircut_details'][number],
  'haircut_details_gallery'
> & {
  haircut_details_gallery: NonNullableHaircutDetailsGallery
}

type HaircutDetails = HaircutDetail[]

export type BarbershopHaircutDetailsGalleryPresent = Omit<
  RawBarbershopDetails,
  'haircut_details'
> & {
  haircut_details: HaircutDetails
}

export function assertHaircutGallery(
  barbershopDetails: RawBarbershopDetails,
): asserts barbershopDetails is BarbershopHaircutDetailsGalleryPresent {
  const noHaircutGalleryCut = barbershopDetails.haircut_details.find(
    (haircut_detail) => haircut_detail.haircut_details_gallery === null,
  )

  if (noHaircutGalleryCut) {
    throw new Error(`No Gallery ${JSON.stringify(barbershopDetails)}`)
  }
}
