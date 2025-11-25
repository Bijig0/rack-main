import { PLACEHOLDER_BLUR_DATA_URL } from '@/app/globals'
import Media from '@/components/Media'

type Props = {
  src: string
  children?: React.ReactNode
}

const BarbershopGallerySubImage = (props: Props) => {
  const { src } = props
  return (
    <div className="relative flex-1 overflow-hidden">
      <Media
        className="aspect-square h-full w-full overflow-hidden rounded-md object-cover"
        src={src}
        controls
        blurDataURL={PLACEHOLDER_BLUR_DATA_URL}
      />
      {props.children ? props.children : null}
    </div>
  )
}

export default BarbershopGallerySubImage
