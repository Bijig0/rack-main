import { z } from 'zod'

import type { getBookingFieldsWithSystemFields } from './getBookingFields'
import getBookingResponsesSchema from './getBookingResponsesSchema'

const getBookingDataSchema = ({
  view = 'booking',
  bookingFields,
}: {
  view: 'booking' | 'reschedule'
  bookingFields: Awaited<ReturnType<typeof getBookingFieldsWithSystemFields>>
}) => {
  return extendedBookingCreateBody.merge(
    z.object({ responses: getBookingResponsesSchema({ bookingFields, view }) }),
  )
}

export default getBookingDataSchema
