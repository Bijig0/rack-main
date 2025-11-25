// import * as A from 'fp-ts/Array';
// import * as S from 'fp-ts/String';
import {
  SUPABASE_AUTH_EMAIL,
  SUPABASE_AUTH_PASSWORD,
  supabase,
} from './supabase.js'

const names = ['finelinebarbersdo']

// const names = [
//   'tofufadez_',
//   'ppcutz_',
//   'murrcuts',
//   'uneektrimz',
//   'ajblendz_',
//   'sh1ftycutz',
//   'gianni_sollazzo',
//   'dr_faded_',
//   'fadezrus_',
//   'jnsnblendz',
//   'v2kblendz',
//   'alejandrosep',
//   'ysfblends',
//   '_drezcxtz',
//   'zizza_barber',
//   's_starbarbershop',
//   'mustacheryonbrunswick',
//   'titscutz',
//   'angelescutzz',
//   'huucutz',
//   'barber.romar',
//   'brevblendz',
//   'coreythebarberr',
//   'khanhdabarber',
//   'maddencuts',
//   'jtcutz_tm',
//   'trimstarrz',
//   'jayblendshair',
//   'selfmade.snipzz',
//   'boiblends',
//   'nkfadez',
//   'sscuts_',
//   'the_anarchy_barber',
//   'jamesgatto.hair',
//   '_sikutz',
//   'barber57_',
//   'denzblenz',
//   'jtblendz.official',
//   'kienkutz',
//   'lmdfades',
//   'bndblendz',
//   'nnbarberz',
//   'bl.cuts',
//   'khng.kutz',
//   'ande_chann',
//   'michaellangelochan',
//   'krichbrian',
//   'lmblendz',
//   'kongtkebarber',
//   'barbrrluu',
//   'simon.blendz',
//   'cbfadezz_',
//   'medzcuts',
//   'hannazfadez',
// ]

const createEmail = (name: string) => {
  return `${name.toLowerCase()}@taperau.com`
}

const insertUserProfile = async (userId: string, email: string) => {
  const { data, error } = await supabase
    .from('user_profile')
    .insert([
      {
        user_id: userId,
        account_type: 'barbershop',
      },
    ])
    .select('id')
    .single()

  if (error) throw error

  return data.id
}

const USER_PASSWORD = '12345678'

const createUser = async (email: string) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.admin.createUser({
    email: email,
    password: USER_PASSWORD,
    email_confirm: true,
  })

  console.log({ user, error })

  if (error) throw error

  return user?.id
}

const insertBarbershopDetails = async (
  userProfileId: number,
  barbershopName: string,
) => {
  const { data, error } = await supabase
    .from('barbershop_details')
    .insert({
      user_profile_id: userProfileId,
      name: barbershopName,
    })
    .select('id')
    .single()

  console.log({ data, error })
}

;(async () => {
  try {
    await supabase.auth.signInWithPassword({
      email: SUPABASE_AUTH_EMAIL,
      password: SUPABASE_AUTH_PASSWORD,
    })

    for await (const name of names) {
      console.log('Creating user')
      const userId = await createUser(createEmail(name))!
      console.log('Created user')

      console.log('Creating user profile')
      const userProfileId = await insertUserProfile(userId!, createEmail(name))
      console.log('Created user profile')

      console.log('Inserting barbershop details')
      await insertBarbershopDetails(userProfileId!, name)
      console.log('Inserted barbershop details')
    }

    return
  } catch (e) {
    console.error(e)
  }
})()
