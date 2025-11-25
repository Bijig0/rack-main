import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

const getImgSrc = (imageBlock: SanityImageSource): string => {
  const defaultImage =
    'https://t4.ftcdn.net/jpg/03/78/40/11/360_F_378401105_9LAka9cRxk5Ey2wwanxrLTFCN1U51DL0.jpg'
  const imageUrlBuilder = urlFor(imageBlock)
  console.log(imageUrlBuilder)
  const imgSrc =
    imageUrlBuilder.options.source !== undefined
      ? imageUrlBuilder.url()
      : defaultImage

  return imgSrc
}

export default getImgSrc
