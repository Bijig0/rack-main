import { LoadingSpinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookingCard } from './booking-card/booking-card'
import { separateBookings } from './separateBookings/separateBookings'
import { useGetBookingDetails } from './useGetBookingDetails'

enum BookingType {
  Upcoming = 'upcoming',
  Recurring = 'recurring',
  Past = 'past',
  Cancelled = 'cancelled',
}

// need user profile id and barbershop details id and u can get

export const BookingsListPreview = () => {
  const { data: bookingsDetails, isLoading, error } = useGetBookingDetails()

  if (bookingsDetails) {
    const {
      cancelledBookings,
      recurringBookings,
      pastBookings,
      upcomingBookings,
    } = separateBookings({ bookingsDetails })
    return (
      <Tabs defaultValue={BookingType.Upcoming} className="w-[400px]">
        <TabsList>
          <TabsTrigger value={BookingType.Upcoming}>Upcoming</TabsTrigger>
          <TabsTrigger value={BookingType.Recurring}>Recurring</TabsTrigger>
          <TabsTrigger value={BookingType.Past}>Past</TabsTrigger>
          <TabsTrigger value={BookingType.Cancelled}>Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={BookingType.Upcoming}>
          {upcomingBookings.map((upcomingBooking) => {
            return <BookingCard bookingDetails={upcomingBooking} />
          })}
        </TabsContent>
        <TabsContent value={BookingType.Recurring}>
          {/* <BookingCard /> */}
        </TabsContent>
        <TabsContent value={BookingType.Past}>Past</TabsContent>
        <TabsContent value={BookingType.Cancelled}>Cancelled</TabsContent>
      </Tabs>
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  throw error
}
