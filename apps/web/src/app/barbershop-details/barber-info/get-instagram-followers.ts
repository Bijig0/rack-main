'use server'

import { IgNotFoundError } from 'instagram-private-api'
import instagramLogin from './instagram-login'

type Args = {
  username: string
  password: string
}

type Return =
  | {
      data: null
      error: string
    }
  | {
      data: number
      error: null
    }

const getInstagramFollowers = async ({
  username,
  password,
}: Args): Promise<Return> => {
  const { ig } = await instagramLogin({ username, password })
  let followerCount: number
  ig!.state.generateDevice(username)
  try {
    const _followerCount = (await ig!.user.usernameinfo(username))
      .follower_count
    followerCount = _followerCount
  } catch (error) {
    console.log({ error })
    if (error instanceof IgNotFoundError) {
      console.log('Running')
      return { data: null, error: 'Username or password incorrect' }
    }
  }

  return { data: followerCount!, error: null }
}

export default getInstagramFollowers
