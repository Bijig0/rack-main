import { createServerClient } from '@/utils/supabase/supabase'
import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  const nextRaw = searchParams.get('nextThree')
  console.log({ nextRaw })
  const second = searchParams.get('nextTwo')
  console.log({ second })
  console.log({ nextParamRaw: searchParams.get('next') })
  console.log({ next })

  const pathName = new URL(next).pathname
  console.log({ pathName })

  const redirectTo = request.nextUrl.clone()
  console.log({ redirectTo })

  redirectTo.pathname = pathName

  const email = searchParams.get('email')
  const parsedEmail = z.string().email().parse(email)
  console.log({ parsedEmail })

  if (token_hash && type) {
    const supabase = createServerClient(cookies())

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      return NextResponse.redirect(redirectTo)
    }

    const { error: userProfileError } = await supabase
      .from('user_profile')
      .update({
        is_email_verified: true,
      })
      .eq('email', parsedEmail)

    console.log({ userProfileError })

    if (userProfileError) throw userProfileError
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/auth/auth-code-error'
  return NextResponse.redirect(redirectTo)
}
