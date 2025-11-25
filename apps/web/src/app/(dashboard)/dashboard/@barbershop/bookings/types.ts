import { Dayjs } from 'dayjs'

export type DateRange = {
  startDate: Dayjs
  endDate: Dayjs
}

export type BookingDetails = {
  haircutName: string
  duration: number
} & {}
