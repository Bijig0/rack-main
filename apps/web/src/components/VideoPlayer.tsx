'use client'

import { cn } from '@/utils/tailwind'

type Props = {
  className?: string
  src?: string
} & React.ComponentPropsWithoutRef<'video'>

export default function VideoPlayer(props: Props) {
  const { src, ...rest } = props

  console.log({ src })

  // const { isInViewport, ref } = useInViewport()
  // console.log({ isInViewport })

  return (
    <video
      // ref={ref}
      // controls
      loop
      autoPlay
      muted
      playsInline
      preload="metadata"
      className={cn('h-full w-full object-cover', props.className)}
      {...rest}
    >
      <source src={`${src}#t=0.001`} type="video/mp4" />
    </video>
  )
}
