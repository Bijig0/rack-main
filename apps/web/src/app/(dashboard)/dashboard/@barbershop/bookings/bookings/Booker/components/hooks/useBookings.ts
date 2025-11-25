import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import dayjs from '@/dayjs'
import { useLocale } from 'sanity'
import {
  createBooking,
  createInstantBooking,
  createRecurringBooking,
} from '../../../lib'
import { BookerEvent } from '../../../types'
import { useBookerStore } from '../../store'
import { getQueryParam, updateQueryParam } from '../../utils/query-param'
import { sdkActionManager } from '../embed/sdk-event'
import type { UseBookingFormReturnType } from './useBookingForm'

export interface IUseBookings {
  event: {
    data?:
      | (Pick<
          BookerEvent,
          | 'id'
          | 'slug'
          | 'hosts'
          | 'requiresConfirmation'
          | 'isDynamic'
          | 'metadata'
          | 'forwardParamsSuccessRedirect'
          | 'successRedirectUrl'
          | 'length'
          | 'recurringEvent'
          | 'schedulingType'
        > & {
          users: Pick<
            BookerEvent['users'][number],
            | 'name'
            | 'username'
            | 'avatarUrl'
            | 'weekStart'
            | 'profile'
            | 'bookerUrl'
          >[]
        })
      | null
  }
  hashedLink?: string | null
  bookingForm: UseBookingFormReturnType['bookingForm']
  metadata: Record<string, string>
  teamMemberEmail?: string
}

export interface IUseBookingLoadingStates {
  creatingBooking: boolean
  creatingRecurringBooking: boolean
  creatingInstantBooking: boolean
}

export interface IUseBookingErrors {
  hasDataErrors: boolean
  dataErrors: unknown
}
export type UseBookingsReturnType = ReturnType<typeof useBookings>

export const useBookings = ({
  event,
  hashedLink,
  bookingForm,
  metadata,
  teamMemberEmail,
}: IUseBookings) => {
  const router = useRouter()
  const eventSlug = useBookerStore((state) => state.eventSlug)
  const rescheduleUid = useBookerStore((state) => state.rescheduleUid)
  const bookingData = useBookerStore((state) => state.bookingData)
  const timeslot = useBookerStore((state) => state.selectedTimeslot)
  const { t } = useLocale()
  const bookingSuccessRedirect = useBookingSuccessRedirect()
  const bookerFormErrorRef = useRef<HTMLDivElement>(null)
  const [instantMeetingTokenExpiryTime, setExpiryTime] = useState<
    Date | undefined
  >()
  const [instantVideoMeetingUrl, setInstantVideoMeetingUrl] = useState<
    string | undefined
  >()
  const duration = useBookerStore((state) => state.selectedDuration)

  const isRescheduling = !!rescheduleUid && !!bookingData

  const bookingId = parseInt(getQueryParam('bookingId') || '0')

  const _instantBooking =
    trpc.viewer.bookings.getInstantBookingLocation.useQuery(
      {
        bookingId: bookingId,
      },
      {
        enabled: !!bookingId,
        refetchInterval: 2000,
        refetchIntervalInBackground: true,
      },
    )
  useEffect(
    function refactorMeWithoutEffect() {
      const data = _instantBooking.data

      if (!data) return
      try {
        const locationVideoCallUrl: string | undefined =
          bookingMetadataSchema.parse(
            data.booking?.metadata || {},
          )?.videoCallUrl

        if (locationVideoCallUrl) {
          setInstantVideoMeetingUrl(locationVideoCallUrl)
        } else {
          showToast(t('something_went_wrong_on_our_end'), 'error')
        }
      } catch (err) {
        showToast(t('something_went_wrong_on_our_end'), 'error')
      }
    },
    [_instantBooking.data],
  )

  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (responseData) => {
      const { uid, paymentUid } = responseData
      const fullName = getFullName(bookingForm.getValues('responses.name'))

      const users = !!event.data?.hosts?.length
        ? event.data?.hosts.map((host) => host.user)
        : event.data?.users

      const validDuration = event.data?.isDynamic
        ? duration || event.data?.length
        : duration && event.data?.metadata?.multipleDuration?.includes(duration)
          ? duration
          : event.data?.length
      const eventPayload = {
        uid: responseData.uid,
        title: responseData.title,
        startTime: responseData.startTime,
        endTime: responseData.endTime,
        eventTypeId: responseData.eventTypeId,
        status: responseData.status,
        paymentRequired: responseData.paymentRequired,
      }
      if (isRescheduling) {
        sdkActionManager?.fire('rescheduleBookingSuccessful', {
          booking: responseData,
          eventType: event.data,
          date: responseData?.startTime?.toString() || '',
          duration: validDuration,
          organizer: {
            name: users?.[0]?.name || 'Nameless',
            email:
              responseData?.userPrimaryEmail ||
              responseData.user?.email ||
              'Email-less',
            timeZone: responseData.user?.timeZone || 'Europe/London',
          },
          confirmed: !(
            responseData.status === BookingStatus.PENDING &&
            event.data?.requiresConfirmation
          ),
        })
        sdkActionManager?.fire('rescheduleBookingSuccessfulV2', eventPayload)
      } else {
        sdkActionManager?.fire('bookingSuccessful', {
          booking: responseData,
          eventType: event.data,
          date: responseData?.startTime?.toString() || '',
          duration: validDuration,
          organizer: {
            name: users?.[0]?.name || 'Nameless',
            email:
              responseData?.userPrimaryEmail ||
              responseData.user?.email ||
              'Email-less',
            timeZone: responseData.user?.timeZone || 'Europe/London',
          },
          confirmed: !(
            responseData.status === BookingStatus.PENDING &&
            event.data?.requiresConfirmation
          ),
        })

        sdkActionManager?.fire('bookingSuccessfulV2', eventPayload)
      }

      if (paymentUid) {
        router.push(
          createPaymentLink({
            paymentUid,
            date: timeslot,
            name: fullName,
            email: bookingForm.getValues('responses.email'),
            absolute: false,
          }),
        )
        return
      }

      if (!uid) {
        console.error('No uid returned from createBookingMutation')
        return
      }

      const query = {
        isSuccessBookingPage: true,
        email: bookingForm.getValues('responses.email'),
        eventTypeSlug: eventSlug,
        seatReferenceUid:
          'seatReferenceUid' in responseData
            ? responseData.seatReferenceUid
            : null,
        formerTime:
          isRescheduling && bookingData?.startTime
            ? dayjs(bookingData.startTime).toString()
            : undefined,
      }

      bookingSuccessRedirect({
        successRedirectUrl: event?.data?.successRedirectUrl || '',
        query,
        booking: responseData,
        forwardParamsSuccessRedirect:
          event?.data?.forwardParamsSuccessRedirect === undefined
            ? true
            : event?.data?.forwardParamsSuccessRedirect,
      })
    },
    onError: (err, _, ctx) => {
      bookerFormErrorRef &&
        bookerFormErrorRef.current?.scrollIntoView({ behavior: 'smooth' })
    },
  })

  const createInstantBookingMutation = useMutation({
    mutationFn: createInstantBooking,
    onSuccess: (responseData) => {
      updateQueryParam('bookingId', responseData.bookingId)
      setExpiryTime(responseData.expires)
    },
    onError: (err, _, ctx) => {
      console.error('Error creating instant booking', err)

      bookerFormErrorRef &&
        bookerFormErrorRef.current?.scrollIntoView({ behavior: 'smooth' })
    },
  })

  const createRecurringBookingMutation = useMutation({
    mutationFn: createRecurringBooking,
    onSuccess: async (responseData) => {
      const booking = responseData[0] || {}
      const { uid } = booking

      if (!uid) {
        console.error('No uid returned from createRecurringBookingMutation')
        return
      }

      const query = {
        isSuccessBookingPage: true,
        allRemainingBookings: true,
        email: bookingForm.getValues('responses.email'),
        eventTypeSlug: eventSlug,
        formerTime:
          isRescheduling && bookingData?.startTime
            ? dayjs(bookingData.startTime).toString()
            : undefined,
      }

      bookingSuccessRedirect({
        successRedirectUrl: event?.data?.successRedirectUrl || '',
        query,
        booking,
        forwardParamsSuccessRedirect:
          event?.data?.forwardParamsSuccessRedirect === undefined
            ? true
            : event?.data?.forwardParamsSuccessRedirect,
      })
    },
  })

  const handleBookEvent = useHandleBookEvent({
    event,
    bookingForm,
    hashedLink,
    metadata,
    teamMemberEmail,
    handleInstantBooking: createInstantBookingMutation.mutate,
    handleRecBooking: createRecurringBookingMutation.mutate,
    handleBooking: createBookingMutation.mutate,
  })

  const errors = {
    hasDataErrors: Boolean(
      createBookingMutation.isError ||
        createRecurringBookingMutation.isError ||
        createInstantBookingMutation.isError,
    ),
    dataErrors:
      createBookingMutation.error ||
      createRecurringBookingMutation.error ||
      createInstantBookingMutation.error,
  }

  // A redirect is triggered on mutation success, so keep the loading state while it is happening.
  const loadingStates = {
    creatingBooking:
      createBookingMutation.isPending || createBookingMutation.isSuccess,
    creatingRecurringBooking:
      createRecurringBookingMutation.isPending ||
      createRecurringBookingMutation.isSuccess,
    creatingInstantBooking: createInstantBookingMutation.isPending,
  }

  return {
    handleBookEvent,
    expiryTime: instantMeetingTokenExpiryTime,
    bookingForm,
    bookerFormErrorRef,
    errors,
    loadingStates,
    instantVideoMeetingUrl,
  }
}
