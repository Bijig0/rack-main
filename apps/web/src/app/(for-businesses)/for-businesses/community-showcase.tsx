import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const CommunityShowcase = () => {
  return (
    <section
      style={{ maxWidth: '1280px' }}
      className="flex flex-col items-center px-4 py-16 mx-auto rounded-xl lg:px-32 lg:pb-24 lg:pt-60"
    >
      <h2 className="text-3xl font-bold text-center lg:text-5xl">
        Join the taper community
      </h2>
      <div className="lg:my-16" />
      <Card className="py-8 border-none">
        <CardContent className="flex flex-col gap-4 px-0 py-0 lg:flex-row">
          <img
            style={{ minHeight: '348px' }}
            className="flex-1 object-cover w-full rounded-xl lg:w-1/2"
            src="https://i.ytimg.com/vi/qf6VxziiMwA/maxresdefault.jpg"
            alt="barber cutting hair"
          />
          <section className="flex flex-col flex-1 gap-4 p-8 bg-purple-300 rounded-xl">
            <h3 className="text-xl font-semibold lg:text-2xl">
              Showcase your talents
            </h3>
            <p className="text-lg">
              By joining TaperAU, you are joining a community of over 300 active
              independent barbers and established barbershops. Our barbers form
              the foundation of our community. We believe that barbers should
              get a chance to explore and grow their brand past an individual
              level to a national stage
            </p>
          </section>
        </CardContent>
      </Card>
      <div className="my-4" />
      <Card className="py-8 border-none">
        <CardContent className="flex flex-col gap-4 px-0 py-0 lg:flex-row">
          <img
            style={{ minHeight: '348px' }}
            className="flex-1 object-cover w-full rounded-xl lg:hidden lg:w-1/2"
            src="https://i.ytimg.com/vi/qf6VxziiMwA/maxresdefault.jpg"
            alt="barber cutting hair"
          />
          <section className="flex flex-col flex-1 gap-4 p-8 bg-purple-300 rounded-xl">
            <h3 className="text-xl font-semibold lg:text-2xl">
              Connect with customers
            </h3>
            <p className="text-lg">
              TaperAU is proud to be Australia's #1 leading barber to consumer
              connection platform. With the rise of haircuts as a social
              phenomenon and the increasing emphasis placed on the independent
              barber from social media, we help connect the two on the largest
              platform based in Australia
            </p>
          </section>
          <img
            style={{ minHeight: '348px' }}
            className="flex-1 hidden object-cover w-full rounded-xl lg:block lg:w-1/2"
            src="https://i.ytimg.com/vi/qf6VxziiMwA/maxresdefault.jpg"
            alt="barber cutting hair"
          />
        </CardContent>
      </Card>
      <div className="my-8" />
      <Button className="flex items-center justify-center px-6 py-6 rounded-xl bg-dark">
        <p className="font-bold text-md">Create your profile</p>
      </Button>
    </section>
  )
}

export default CommunityShowcase
