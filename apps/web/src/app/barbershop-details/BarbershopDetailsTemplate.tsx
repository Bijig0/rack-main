import DesktopBreakpoint from '@/components/DesktopBreakpoint'
import MobileBreakpoint from '@/components/MobileBreakpoint'
import { cn } from '@/utils/tailwind'
import React from 'react'

type Props = {
  Header?: (...args: any[]) => React.ReactNode
  Footer?: (...args: any[]) => React.ReactNode
  FeaturedCut: (...args: any[]) => React.ReactNode
  DesktopOtherCuts: (...args: any[]) => React.ReactNode
  MobileOtherCuts: (...args: any[]) => React.ReactNode
  DesktopAddOns: (...args: any[]) => React.ReactNode
  MobileAddOns: (...args: any[]) => React.ReactNode
  BarbershopPreview: (...args: any[]) => React.ReactNode
  BarbershopGallery: (...args: any[]) => React.ReactNode
  BarberInfo: (...args: any[]) => React.ReactNode
  Reviews: (...args: any[]) => React.ReactNode
  About: (...args: any[]) => React.ReactNode
  outerClassName?: string
  innerClassName?: string
  additionalComponents?: () => React.ReactNode
}

const BarbershopDetailsTemplate = (props: Props) => {
  const {
    Header,
    Footer,
    FeaturedCut,
    DesktopOtherCuts,
    MobileOtherCuts,
    DesktopAddOns,
    MobileAddOns,
    BarbershopPreview,
    BarbershopGallery,
    BarberInfo,
    Reviews,
    About,
    outerClassName,
    innerClassName,
    additionalComponents,
  } = props

  return (
    <section className={outerClassName}>
      {Header && <Header />}
      <section
        className={cn(
          'overflow-x-hidden transition-[margin] md:overflow-y-hidden lg:mx-auto lg:grid lg:grid-cols-[65%_33%] lg:gap-4',
          innerClassName,
        )}
      >
        {additionalComponents && additionalComponents()}
        <section className="">
          <section className="space-y-4">
            <BarbershopPreview />
            <BarbershopGallery />
          </section>
          <div className="my-8" />
          <MobileBreakpoint>
            <FeaturedCut />
          </MobileBreakpoint>
          <div className="my-8" />
          <DesktopBreakpoint>
            <DesktopOtherCuts />
          </DesktopBreakpoint>
          <MobileBreakpoint>
            <MobileOtherCuts />
          </MobileBreakpoint>
          <div className="my-8" />
          <DesktopBreakpoint>
            <DesktopAddOns />
          </DesktopBreakpoint>
          <MobileBreakpoint>
            <MobileAddOns />
          </MobileBreakpoint>
          <div className="my-8" />
          <About />
          <div className="my-8" />
          <MobileBreakpoint>
            <BarberInfo />
          </MobileBreakpoint>
          <div className="my-8" />
          <Reviews />
          <div className="my-8" />
        </section>

        <DesktopBreakpoint>
          <div className="space-y-4">
            <FeaturedCut />
            <BarberInfo />
          </div>
        </DesktopBreakpoint>
      </section>
      {Footer && <Footer />}
    </section>
  )
}

export default BarbershopDetailsTemplate
