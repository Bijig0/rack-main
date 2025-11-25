import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'

import customParseFormat from 'dayjs/plugin/customParseFormat'
import isToday from 'dayjs/plugin/isToday'

dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(isToday)


// This is used to prevent weird datetime parsing shit. Like
// We are just working with the actual dates so this is correct.

// TODO: Write an ESLint rule to disallow all Dates and only allow DayJS
export const createDayJS = () => dayjs.utc

const dayjsUtc = dayjs.utc

export default dayjsUtc
