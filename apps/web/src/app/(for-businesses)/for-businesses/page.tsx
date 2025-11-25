import MainSiteFooter from '@/app/(main-site)/MainSiteFooter'
import ForBusinessHeader from './ForBusinessHeader'
import CommunityShowcase from './community-showcase'
import FAQ from './faq'
import ForBusinessHero from './for-business-hero/ForBusinessHero'
import HowToGetStarted from './how-to-get-started'

const page = () => {
  return (
    <>
      <main className="font-business">
        <ForBusinessHeader />
        <ForBusinessHero />
        <CommunityShowcase />
        <HowToGetStarted />
        <FAQ />
        <MainSiteFooter className="dark" />
      </main>
    </>
  )
}

export default page
