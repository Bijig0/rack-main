import { RawBarbershopDetails } from '@/app/(dashboard)/dashboard/@barbershop/page'

export type BarbershopGalleryPresent = Omit<
  RawBarbershopDetails,
  'barbershop_gallery'
> & {
  barbershop_gallery: NonNullable<RawBarbershopDetails['barbershop_gallery']>
}

export function assertGallery(
  barbershopDetails: RawBarbershopDetails,
): asserts barbershopDetails is BarbershopGalleryPresent {
  if (!barbershopDetails.barbershop_gallery) {
    throw new Error(`No Gallery ${JSON.stringify(barbershopDetails)}`)
  }
}
