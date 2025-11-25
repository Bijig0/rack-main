import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/utils/tailwind'
import FeaturedCutAvatar from './FeaturedCutAvatar'
import React from 'react'

type Props = {
  className?: string
  name: () => React.ReactNode
  cutName: () => React.ReactNode
  cutPrice: () => React.ReactNode
  cutMainimage: string
  galleryButton: () => React.ReactNode
}

const FeaturedCut = (props: Props) => {
  const {
    className,
    cutName,
    cutPrice,
    cutMainimage,
    name,
    galleryButton,
  } = props

  return (
    <Card className={cn('overflow-visible rounded-xl', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        {name()}
      </CardHeader>
      <CardContent className="flex items-center justify-between lg:block lg:space-y-4">
        <div className="flex items-center gap-4 pt-2">
          <FeaturedCutAvatar src={cutMainimage} />
          <div>
            {cutName()}
            {cutPrice()}
          </div>
        </div>
        {galleryButton()}
      </CardContent>
    </Card>
  )
}

export default FeaturedCut
