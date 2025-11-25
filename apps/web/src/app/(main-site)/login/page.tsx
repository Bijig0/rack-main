import Image from 'next/image'

import LoginForm from './LoginForm'
import LoginHeroImage from './LoginHero.jpeg'

export default function page() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <LoginForm />
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={LoginHeroImage}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover brightness-[0.6] dark:grayscale"
        />
      </div>
    </div>
  )
}
