import { sanityFetch } from '@/sanity/lib/fetch'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import { getServerSideSitemap } from 'next-sitemap'
import { POSTS_QUERYResult } from '../../../sanity.types'

const createUrl = (slug: string) => {
  return `${process.env.SITE_URL}/blogs/${slug}`    
}   

export async function handler(request: Request) {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

  const posts = await sanityFetch<POSTS_QUERYResult>({
    query: POSTS_QUERY,
  })

  const slugs = posts.map((post) => ({
    slug: post.slug,
  }))

  const locs = slugs.map((slug) => {
    return createUrl(slug!.slug?.current!)
  })

  const sitemap = locs.map((loc) => {
    return {
      loc,
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    }
  })


  return getServerSideSitemap(sitemap)
}