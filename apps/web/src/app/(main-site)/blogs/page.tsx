import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/fetch'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import { format } from 'date-fns'
import Link from 'next/link'
import IconEvelope from '../../../../public/images/icon-blog.png'
import { POSTS_QUERYResult } from '../../../../sanity.types'
import BlogPreview from './blog-preview'

const getCategoryNames = (post: POSTS_QUERYResult[number]) => {
  const allTags = post.categories?.filter((item) => item !== null) ?? []

  const tags = allTags
    ?.map(({ title }) => title)
    .filter((item) => item !== null)

  const uniqueTags = [...new Set(tags)]

  return uniqueTags
}

const getPublishedAtDateString = (publishedAt: string) => {
  const asDate = new Date(publishedAt)
  const formattedDate = format(asDate, 'MMMM d, yyyy')
  return formattedDate
}

const page = async () => {
  const posts = await sanityFetch<POSTS_QUERYResult>({
    query: POSTS_QUERY,
  })

  console.log({ posts })

  console.log(posts[0].categories)

  return (
    <div>
      <div className="container mx-auto">
        <div className="py-16 lg:py-20">
          <div>
            <Image
              width={32}
              height={32}
              src={IconEvelope}
              alt="icon envelope"
            />
          </div>

          <h1 className="pt-5 text-4xl font-semibold font-body dark:text-white md:text-5xl lg:text-6xl">
            Blog
          </h1>

          <div className="pt-3 sm:w-3/4">
            <p className="text-xl font-light font-body dark:text-white">
              Hi-Up's articles, news, latest updates and more!
            </p>
          </div>

          <div className="pt-8 lg:pt-12">
            {posts.map((post) => {
              const { title, publishedAt, categories, slug } = post
              const categoryNames = getCategoryNames(post)
              const publishedAtDateString = getPublishedAtDateString(
                publishedAt!,
              )
              console.log({ categoryNames })
              const postUrl = `/blogs/${slug!.current}`

              return (
                  <BlogPreview
                    key={postUrl}
                    title={title!}
                    publishedAt={publishedAtDateString}
                    categories={categoryNames}
                    postUrl={postUrl}
                  />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
export default page
