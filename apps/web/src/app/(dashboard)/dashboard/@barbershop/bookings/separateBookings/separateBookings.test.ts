import { BookingsDetails, separateBookings } from './separateBookings'

describe('separateBookings', () => {
  it('should separate bookings into the correct categories', () => {
    const bookingsDetails: BookingsDetails = [
      {
        status: 'cancelled',
        addon_details: { name: 'Shave' },
        haircut_details: { name: 'Buzz Cut' },
      },
      {
        status: 'recurring',
        addon_details: { name: 'Beard Trim' },
        haircut_details: { name: 'Classic Cut' },
      },
      {
        status: 'upcoming',
        addon_details: null,
        haircut_details: { name: 'Undercut' },
      },
      {
        status: 'past',
        addon_details: { name: 'Head Massage' },
        haircut_details: { name: null },
      },
      {
        status: 'cancelled',
        addon_details: null,
        haircut_details: { name: 'Fade' },
      },
    ]

    const result = separateBookings({ bookingsDetails })

    expect(result.cancelledBookings).toHaveLength(2)
    expect(result.recurringBookings).toHaveLength(1)
    expect(result.upcomingBookings).toHaveLength(1)
    expect(result.pastBookings).toHaveLength(1)

    expect(result.cancelledBookings).toEqual([
      {
        status: 'cancelled',
        addon_details: { name: 'Shave' },
        haircut_details: { name: 'Buzz Cut' },
      },
      {
        status: 'cancelled',
        addon_details: null,
        haircut_details: { name: 'Fade' },
      },
    ])

    expect(result.recurringBookings).toEqual([
      {
        status: 'recurring',
        addon_details: { name: 'Beard Trim' },
        haircut_details: { name: 'Classic Cut' },
      },
    ])

    expect(result.upcomingBookings).toEqual([
      {
        status: 'upcoming',
        addon_details: null,
        haircut_details: { name: 'Undercut' },
      },
    ])

    expect(result.pastBookings).toEqual([
      {
        status: 'past',
        addon_details: { name: 'Head Massage' },
        haircut_details: { name: null },
      },
    ])
  })

  it('should return empty arrays when there are no bookings', () => {
    const bookingsDetails: BookingsDetails = []

    const result = separateBookings({ bookingsDetails })

    expect(result.cancelledBookings).toHaveLength(0)
    expect(result.recurringBookings).toHaveLength(0)
    expect(result.upcomingBookings).toHaveLength(0)
    expect(result.pastBookings).toHaveLength(0)
  })

  it('should correctly separate bookings when only one status is present', () => {
    const bookingsDetails: BookingsDetails = [
      {
        status: 'upcoming',
        addon_details: { name: 'Scalp Massage' },
        haircut_details: { name: 'Layered Cut' },
      },
    ]

    const result = separateBookings({ bookingsDetails })

    expect(result.cancelledBookings).toHaveLength(0)
    expect(result.recurringBookings).toHaveLength(0)
    expect(result.upcomingBookings).toHaveLength(1)
    expect(result.pastBookings).toHaveLength(0)

    expect(result.upcomingBookings).toEqual([
      {
        status: 'upcoming',
        addon_details: { name: 'Scalp Massage' },
        haircut_details: { name: 'Layered Cut' },
      },
    ])
  })
})
