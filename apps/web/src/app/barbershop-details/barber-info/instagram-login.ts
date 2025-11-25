'use server'

import { IgApiClient } from 'instagram-private-api'

type Args = {
  username: string
  password: string
}

type IGUserInfo = {
  ig: IgApiClient
}

const instagramLogin = async ({
  username,
  password,
}: Args): Promise<IGUserInfo> => {
  const ig = new IgApiClient()
  ig.state.generateDevice(username)
  await ig.account.login(username, password)
  return { ig }
}

export default instagramLogin
