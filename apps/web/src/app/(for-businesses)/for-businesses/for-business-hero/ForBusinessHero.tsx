import ServerSideDesktopBreakpoint from '@/components/DesktopBreakpoint'
import ServerSideMobileBreakpoint from '@/components/MobileBreakpoint'
import { Separator } from '@/components/ui/separator'
import ForBusinessSignUpForm from './ForBusinessSignUpForm'

const HeroSubtext = () => {
  return (
    <div className="text-white">
      <p className="text-lg">
        Welcome to <strong>THE</strong> platform that{' '}
        <strong>connects individuals</strong> with Australia’s finest{' '}
        <strong>independent barbers</strong> and{' '}
        <strong>established barbershops!</strong>
      </p>
      <Separator className="my-4" />
      <div>
        <p className="text-lg ">
          💼 <strong>Build</strong> your <strong>online portfolio</strong>
        </p>
        <p className="text-lg ">
          🌎 <strong>Connect</strong> to a <strong>national audience</strong>
        </p>
        {/* <p className="text-lg ">
          ⚙️ <strong>Integrates</strong> with your{' '}
          <strong>existing systems</strong>{' '}
          <span className="text-sm">(Square, SetMore...)</span>
        </p> */}
        <Separator className="my-4" />
      </div>
    </div>
  )
}

const ForBusinessHero = () => {
  return (
    <section className="relative flex items-center justify-center">
      <div
        style={{ width: '100vw' }}
        className="absolute inset-0 z-[-10] bg-dark"
      />
      <div
        id="main"
        style={{ maxWidth: '1280px' }}
        className="flex flex-col gap-8 px-5 pt-16 pb-24 bg-dark md:px-32 lg:flex-row lg:items-center lg:justify-center lg:py-48 lg:pt-8"
      >
        <div className="text-white lg:mt-8 lg:flex-[3_3_0%] lg:space-y-8 lg:pr-8">
          <h1 className="text-3xl font-bold lg:text-business-header">
            Expand your brand <br />
            Create your profile today
          </h1>
          <ServerSideDesktopBreakpoint>
            <HeroSubtext />
          </ServerSideDesktopBreakpoint>
        </div>
        <ForBusinessSignUpForm />
        <ServerSideMobileBreakpoint>
          <HeroSubtext />
        </ServerSideMobileBreakpoint>
      </div>
    </section>
  )
}

export default ForBusinessHero
