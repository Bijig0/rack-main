'use client'
import BarbershopDetailsTemplate from '@/app/barbershop-details/BarbershopDetailsTemplate'
import PageDimmer from './PageDimmer'
import { useDashboardContext } from './barbershop-dashboard-context'
import DashboardAbout from './dashboard-barber-details/about/DashboardAbout'
import DashboardDesktopAddOns from './dashboard-barber-details/addons/DashboardDesktopAddOns'
import DashboardMobileAddOns from './dashboard-barber-details/addons/DashboardMobileAddOns'
import DashboardBarberInfo from './dashboard-barber-details/barber-info/DashboardBarberInfo'
import DashboardBarbershopGallery from './dashboard-barber-details/barbershop-gallery/DashboardBarbershopGallery'
import DashboardBarbershopPreview from './dashboard-barber-details/barbershop-preview/DashboardBarbershopPreview'
import DashboardFeaturedCut from './dashboard-barber-details/featured-cut/DashboardFeaturedCut'
import DashboardDesktopOtherCuts from './dashboard-barber-details/other-cuts/DashboardDesktopOtherCuts'
import DashboardMobileOtherCuts from './dashboard-barber-details/other-cuts/DashboardMobileOtherCuts'
import DashboardReviews from './dashboard-barber-details/reviews/DashboardReviews'

const BarbershopDetails = () => {
  const { isEditMode, toggleMode } = useDashboardContext()

  return (
    <BarbershopDetailsTemplate
      innerClassName={isEditMode ? 'grid-cols-[64%_32%] md:px-8 py-4' : ''}
      DesktopOtherCuts={DashboardDesktopOtherCuts}
      MobileOtherCuts={DashboardMobileOtherCuts}
      DesktopAddOns={DashboardDesktopAddOns}
      MobileAddOns={DashboardMobileAddOns}
      FeaturedCut={DashboardFeaturedCut}
      BarberInfo={DashboardBarberInfo}
      Reviews={DashboardReviews}
      About={DashboardAbout}
      BarbershopGallery={DashboardBarbershopGallery}
      BarbershopPreview={DashboardBarbershopPreview}
      additionalComponents={() => isEditMode && <PageDimmer />}
    />
  )
}

export default BarbershopDetails
