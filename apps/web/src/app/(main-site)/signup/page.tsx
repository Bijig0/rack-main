import Image from 'next/image'

import SignUpHeroImage from './SignUpHero.webp'
import SignUpForm from './SignUpForm'

export default function page() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">
        <Image
          src={SignUpHeroImage}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover brightness-[0.6] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <SignUpForm />
      </div>
    </div>
  )
}
