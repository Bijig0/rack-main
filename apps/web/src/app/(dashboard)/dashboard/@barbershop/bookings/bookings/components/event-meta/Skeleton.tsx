import classNames from '@/app/classNames'
import Skeleton from 'react-loading-skeleton'

export const EventMetaSkeleton = () => (
  <div className="flex flex-col">
    <Skeleton className="h-6 w-6 rounded-full" />
    <Skeleton className="mt-2 h-5 w-32" />
    <Skeleton className="mt-2 h-8 w-48" />

    <div className="mt-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="mb-2 flex flex-row items-center" key={i}>
          <Skeleton className="mr-3 h-5 w-5 rounded-full" />
          <Skeleton
            className={classNames('h-6', i > 1 ? 'w-24' : 'w-32')}
          />
        </div>
      ))}
    </div>
  </div>
)
