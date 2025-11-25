import Urls from '@/app/urls/urls'
import { sanityFetch } from '@/sanity/lib/fetch'
import { POST_QUERY } from '@/sanity/lib/queries'
import { cn } from '@/utils/tailwind'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'
import AuthorImage from '../../../../../public/images/author.webp'
import { POST_QUERYResult } from '../../../../../sanity.types'
import { getCategoryBgColor } from '../getCategoryBgColor'
import getImgSrc from '../getImageSrc'

// export async function generateStaticParams() {
//   const posts = await sanityFetch<POSTS_QUERYResult>({
//     query: POSTS_QUERY,
//   })

//   return posts.map((post) => ({
//     slug: post.slug,
//   }))
// }

const propsSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
})

const page = async (props: unknown) => {
  const {
    params: { slug },
  } = propsSchema.parse(props)

  const post = await sanityFetch<POST_QUERYResult>({
    query: POST_QUERY,
    params: { slug },
  })

  console.log(post)

  const categories = post?.categories ?? []

  // const date = new Date(publishedAt);
  // const formattedDate = format(date, "d MMMM yyyy");
  const formattedDate = '5 May 2024'

  const imgSrc = getImgSrc(post?.mainImage!)

  console.log(post)
  // const authorImgSrc = getImgSrc(author);
  // console.log({ authorImgSrc });

  return (
    <div>
      <div className="container mx-auto">
        <div className="pt-16 lg:pt-20">
          <div className="my-4"></div>
          <div className="border-grey-lighter space-x-2 border-b pb-8 sm:pb-12">
            {categories.map((category, index) => (
              <span
                key={category.title}
                className={cn(
                  'bg-green-light font-body text-green mb-5 inline-block rounded-full px-2 py-1 text-sm sm:mb-8',
                  getCategoryBgColor(index),
                )}
              >
                {category.title}
              </span>
            ))}
            <h2 className="font-body block text-3xl font-semibold leading-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
              {post!.title}
            </h2>
            <div className="flex items-center pt-5 sm:pt-8">
              <p className="font-body pr-2 font-light text-primary dark:text-white">
                {formattedDate}
              </p>
              <span className="font-body text-grey">//</span>
              <p className="font-body pl-2 font-light text-primary dark:text-white">
                4 min read
              </p>
            </div>
            <div className="my-4"></div>
            <div className="flex items-center justify-start gap-2">
              <Image
                width={32}
                height={32}
                src={AuthorImage}
                alt="author image"
                className="h-8 w-8 rounded-full object-cover"
              />
              <p className="font-body font-light text-primary dark:text-white">
                {post?.author?.name}
              </p>
            </div>
          </div>

          {/* <Image
            src={imgSrc}
            alt="blog image"
            width={1024}
            height={768}
            className="w-80"
          /> */}

          {/* Wrapper for actual blog content */}
          <div className="border-grey-lighter dark:prose-dark prose max-w-none border-b py-8 sm:py-12">
            {/* Actual blog content */}
            <PortableText value={post?.body!} />
          </div>
          <div className="flex items-center py-10">
            <Link
              href={Urls.blogs}
              className="font-body pr-5 font-medium text-primary hover:underline dark:text-white"
            >
              Back
            </Link>
            <span className="font-body pr-5 font-medium text-primary dark:text-white">
              Share
            </span>
            <a href="#">
              <i className="bx bxl-facebook text-2xl text-primary transition-colors hover:text-secondary dark:text-white dark:hover:text-secondary"></i>
            </a>
            <a href="#">
              <i className="bx bxl-twitter pl-2 text-2xl text-primary transition-colors hover:text-secondary dark:text-white dark:hover:text-secondary"></i>
            </a>
            <a href="#">
              <i className="bx bxl-linkedin pl-2 text-2xl text-primary transition-colors hover:text-secondary dark:text-white dark:hover:text-secondary"></i>
            </a>
            <a href="#">
              <i className="bx bxl-reddit pl-2 text-2xl text-primary transition-colors hover:text-secondary dark:text-white dark:hover:text-secondary"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
export default page
