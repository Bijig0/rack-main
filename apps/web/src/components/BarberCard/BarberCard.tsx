'use client'
import { getBarbershops } from '@/app/(main-site)/barbershops/useGetBarbershops'
import { PLACEHOLDER_BLUR_DATA_URL, PLACEHOLDER_IMAGE_URL } from '@/app/globals'
import Urls from '@/app/urls/urls'
import InstagramIcon from '@/components/InstagramIcon'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/tailwind'
import Link from 'next/link'
import { MdLocationPin } from 'react-icons/md'
import Media, { getMediaType } from '../Media'

type Props = {
  index: number
  cardClassName?: string
  cardContentClassName?: string
  isHoverable?: boolean
  onClick?: (...args: any[]) => void
  barbershopDetails: Awaited<ReturnType<typeof getBarbershops>>[number]
}

const BarberCard = (props: Props) => {
  const {
    index,
    cardClassName,
    cardContentClassName,
    isHoverable,
    barbershopDetails,
  } = props

  const { name, tagline, exact_address, general_address, main_image } =
    barbershopDetails

  const mediaType = getMediaType(main_image ?? PLACEHOLDER_IMAGE_URL)

  const PRIORITY_IMAGE_INDEXES = [0, 1, 2]

  return (
    <Card
      className={cn(
        'shrink-0 basis-2/3 rounded-xl border-none py-2',
        cardClassName,
        isHoverable && 'group cursor-pointer',
      )}
    >
      <CardContent
        className={cn('p-0', cardContentClassName, isHoverable && '')}
      >
        <Link href={Urls.barbershopsDetail(barbershopDetails.name)}>
          <div className="inline-block aspect-square w-full overflow-hidden rounded-xl">
            <Media
              className={cn(
                'aspect-square',
                isHoverable &&
                  'h-full w-full object-cover transition-all group-hover:opacity-80',
              )}
              src={main_image ?? PLACEHOLDER_IMAGE_URL}
              priorty={PRIORITY_IMAGE_INDEXES.includes(index)}
              blurDataURL={PLACEHOLDER_BLUR_DATA_URL}
            />
          </div>
        </Link>
        <Link href={Urls.barbershopsDetail(barbershopDetails.name)}>
          <div className="space-y-0">
            {/* <Badge className={cn('pointer-events-none rounded-md bg-red-600')}>
          Low Taper Fade
        </Badge> */}
            <p className="text-xl font-bold">{name}</p>
            {/* <div className="flex items-center justify-start gap-1">
        <p className="text-xs font-bold">4.4</p>

        <div className="flex">
          <MdOutlineStar size={12} />
          <MdOutlineStar size={12} />
          <MdOutlineStar size={12} />
          <MdOutlineStar size={12} />
          <MdOutlineStar size={12} />
        </div>

        <a
          href="/#reviews"
          className="text-xs text-blue-400 underline cursor-pointer"
        >
          (3)
        </a>
      </div> */}
            <p
              className={cn(
                'font-primary w-3/5 font-futura text-md lg:w-4/5',
                !tagline && 'hidden',
              )}
            >
              {tagline}
            </p>

            {barbershopDetails.handle && (
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-1">
                  <InstagramIcon className="h-4 w-4" />
                  <p className={cn('text-sm font-bold')}>
                    {barbershopDetails.handle}
                  </p>
                </div>
                {/* <div className="flex items-center justify-start gap-1">
              <FaPerson className="w-4 h-4" />
              <p className="relative text-sm font-bold">
                {barbershopDetails.follower_count} Followers
              </p>
            </div> */}
              </div>
            )}

            <div className="flex items-center justify-start gap-1">
              <MdLocationPin className="text-black" />
              <p className="font-primary text-sm underline lg:text-sm">
                {exact_address}
              </p>
            </div>

            {/* <div className="flex items-center justify-start gap-1">
          <InstagramIcon size={12} />
          <a className="text-xs underline cursor-pointer text-muted-foreground">
            @jaypark
          </a>
        </div> */}
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}

export default BarberCard
