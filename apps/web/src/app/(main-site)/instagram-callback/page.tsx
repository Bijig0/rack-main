// 'use client'
// import { useSearchParams } from 'next/navigation'
// import { useEffect } from 'react'
// import { z } from 'zod'
// import instagramCodeExchange from './instagram-code-exchange'

// const codeSchema = z.string()

// const page = () => {
//   const searchParams = useSearchParams()

//   const code = searchParams.get('code')
//   const parsedCode = codeSchema.parse(code)
//   console.log({ parsedCode })

//   useEffect(() => {
//     const exchangeCode = async () => {
//       await instagramCodeExchange(parsedCode)
//     }

//     exchangeCode()

//   }, [])
//   return (
//     <div className="mx-auto mt-8 prose">
//       <h1>Your account has been successfully authorized</h1>
//       <p>You will be forwarded shortly</p>
//     </div>
//   )
// }

// export default page

export default function page() {
  return (
    <div className="mx-auto mt-8 prose">
      <h1>Your account has been successfully authorized</h1>
      <p>You will be forwarded shortly</p>
    </div>
  )
}
