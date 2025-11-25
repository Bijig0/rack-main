import Image from 'next/image'
import VideoPlayer from './VideoPlayer'

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'] as const
const videoExtensions = [
  '.mp4',
  '.webm',
  '.ogg',
  '.mpeg',
  '.mov',
  '.mp4',
  '.mpv',
] as const

export type MediaType = 'image' | 'video'

export const getMediaType = (src: string): MediaType => {
  for (const extension of imageExtensions) {
    if (src.endsWith(extension)) return 'image'
  }
  for (const extension of videoExtensions) {
    if (src.endsWith(extension)) return 'video'
  }

  throw new Error(`Unknown media type for ${src}`)
}

type Props = {
  src: string
  className?: string
  alt?: string
  controls?: boolean
  priorty?: boolean
  blurDataURL?: string
}

const Media = (props: Props) => {
  const { src, className } = props
  const mediaType = getMediaType(src)
  console.log({ mediaType, src })
  return mediaType === 'video' ? (
    <VideoPlayer className={className} src={src} controls={props.controls} />
  ) : (
    <Image
      width={300}
      height={300}
      className={className}
      src={src}
      alt={props.alt ?? 'media'}
      priority={props.priorty}
      placeholder={props.blurDataURL ? 'blur' : 'empty'}
      blurDataURL={props.blurDataURL}
    />
  )
}

export default Media
