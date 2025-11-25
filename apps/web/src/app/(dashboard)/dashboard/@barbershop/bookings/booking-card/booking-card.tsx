import { BookingsDetails } from '../separateBookings/separateBookings'

type Props = {
  bookingDetails: BookingsDetails[number]
}

export const BookingCard = ({ bookingDetails }: Props) => {
  return <div>{JSON.stringify(bookingDetails)}</div>
}
