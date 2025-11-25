import { cn } from '@/utils/tailwind'
import Link from 'next/link'
import { getCategoryBgColor } from './getCategoryBgColor'

type Props = {
  categories: string[]
  title: string
  publishedAt: string
  postUrl: string
}

const BlogPreview = (props: Props) => {
  const { categories, title, publishedAt, postUrl } = props
  console.log({ categories })
  return (
    <div className="border-grey-lighter space-x-2 border-b pb-8">
      {categories.map((category, index) => {
        return (
          <span
            className={cn(
              'font-body text-green mb-4 inline-block rounded-full px-2 py-1 text-sm',
              getCategoryBgColor(index),
            )}
          >
            {category}
          </span>
        )
      })}
      <Link
        href={postUrl}
        className="font-body hover:text-green block text-lg font-semibold transition-colors dark:text-white dark:hover:text-secondary"
      >
        {title}
      </Link>
      <div className="flex items-center pt-4">
        <p className="font-body pr-2 font-light dark:text-white">
          {publishedAt}
        </p>
        <span className="font-body text-grey dark:text-white">//</span>
        <p className="font-body pl-2 font-light dark:text-white">4 min read</p>
      </div>
    </div>
  )
}

export default BlogPreview
