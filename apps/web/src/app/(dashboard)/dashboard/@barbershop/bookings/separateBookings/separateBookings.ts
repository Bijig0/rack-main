import { getBookingDetails } from '../useGetBookingDetails'

export type BookingsDetails = Awaited<ReturnType<typeof getBookingDetails>>

type Args = {
  bookingsDetails: BookingsDetails
}

type FilteredBookings<T extends BookingsDetails[number]['status']> =
  BookingsDetails[number] & {
    status: T
  }

type Return = {
  cancelledBookings: FilteredBookings<'cancelled'>[]
  recurringBookings: FilteredBookings<'recurring'>[]
  upcomingBookings: FilteredBookings<'upcoming'>[]
  pastBookings: FilteredBookings<'past'>[]
}

export const separateBookings = ({ bookingsDetails }: Args): Return => {
  const cancelledBookings = bookingsDetails.filter(
    (booking): booking is FilteredBookings<'cancelled'> =>
      booking.status === 'cancelled',
  )
  const recurringBookings = bookingsDetails.filter(
    (booking): booking is FilteredBookings<'recurring'> =>
      booking.status === 'recurring',
  )
  const upcomingBookings = bookingsDetails.filter(
    (booking): booking is FilteredBookings<'upcoming'> =>
      booking.status === 'upcoming',
  )
  const pastBookings = bookingsDetails.filter(
    (booking): booking is FilteredBookings<'past'> => booking.status === 'past',
  )

  return {
    cancelledBookings,
    recurringBookings,
    upcomingBookings,
    pastBookings,
  }
}
