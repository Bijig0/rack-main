'use server'

import { z } from 'zod'

const instagramCodeExchangeSchema = z.object({
  access_token: z.string(),
  user_id: z.string(),
})

type InstagramCodeExchangeSchema = z.infer<typeof instagramCodeExchangeSchema>

const instagramCodeExchange = async (
  code: string,
): Promise<InstagramCodeExchangeSchema> => {
  const redirectUrl =
    'https://viable-wren-extremely.ngrok-free.app/instagram-callback/'

  const formData = new FormData()

  // Add form fields
  console.log({ id: process.env.INSTAGRAM_APP_ID })

  formData.append('client_id', process.env.INSTAGRAM_APP_ID)
  formData.append('client_secret', process.env.INSTAGRAM_APP_SECRET)
  formData.append('grant_type', 'authorization_code')
  formData.append('redirect_uri', redirectUrl)
  formData.append('code', code)

  const response = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  const parsedData = instagramCodeExchangeSchema.parse(data)

  console.log({ parsedData })

  return parsedData
}

export default instagramCodeExchange
