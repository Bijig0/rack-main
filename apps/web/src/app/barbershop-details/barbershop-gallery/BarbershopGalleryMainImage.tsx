import { PLACEHOLDER_BLUR_DATA_URL } from '@/app/globals'
import Media from '@/components/Media'

type Props = {
  src: string
  children?: React.ReactNode
}

const BarbershopGalleryMainImage = (props: Props) => {
  const { src } = props
  return (
    <div className="relative lg:w-0 lg:w-0 lg:flex-[3_3_0%]">
      <Media
        className="aspect-square h-full w-full rounded-md object-cover"
        src={src}
        alt="main gallery image"
        controls
        blurDataURL={PLACEHOLDER_BLUR_DATA_URL}
      />
      {props.children ? props.children : null}
    </div>
  )
}

export default BarbershopGalleryMainImage
