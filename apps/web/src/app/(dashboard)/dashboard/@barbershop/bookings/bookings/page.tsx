'use client'
import { Booker } from './Booker'

const page = () => {
  const username = 'TEST_USERNAME'
  const slug = 'SLUG'
  return (
    <Booker
      username={username}
      eventSlug={slug}
      bookingData={{}}
      //   hideBranding={isBrandingHidden}
      entity={{}}
      bookerLayout={{
        layout: 'mobile',
      }}
      slots={{
        selectedTimeslot: '',
        setSelectedTimeslot: () => {},
      }}
      bookerForm={{}}
      bookings={{}}
      verifyEmail={{}}
      calendars={{}}
      event={{
        isSuccess: true,
        isError: false,
        isPending: false,
        data: {},
      }}
      durationConfig={undefined}
      orgBannerUrl={undefined}
      /* TODO: Currently unused, evaluate it is needed-
       *       Possible alternative approach is to have onDurationChange.
       */
      duration={5}
      schedule={{
        data: {},
      }}
    />
  )
}

export default page
