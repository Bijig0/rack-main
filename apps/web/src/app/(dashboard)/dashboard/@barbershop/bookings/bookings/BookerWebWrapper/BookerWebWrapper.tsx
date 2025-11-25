import dayjs from 'dayjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { Booker as BookerComponent } from '../Booker/Booker'
import { sdkActionManager } from '../Booker/components/embed/sdk-event'
import { useBookerLayout } from '../Booker/components/hooks/useBookerLayout'
import { useBookingForm } from '../Booker/components/hooks/useBookingForm'
import { useBookings } from '../Booker/components/hooks/useBookings'
import { useCalendars } from '../Booker/components/hooks/useCalendars'
import { useSlots } from '../Booker/components/hooks/useSlots'
import { useVerifyCode } from '../Booker/components/hooks/useVerifyCode'
import { useVerifyEmail } from '../Booker/components/hooks/useVerifyEmail'
import {
  DEFAULT_DARK_BRAND_COLOR,
  DEFAULT_LIGHT_BRAND_COLOR,
} from '../Booker/constants'
import { useBookerStore, useInitializeBookerStore } from '../Booker/store'
import { BookerLayouts, BookerProps } from '../Booker/types'
import { useEvent, useScheduleForEvent } from '../Booker/utils/event'
import { useBrandColors } from '../Booker/utils/use-brand-colors'

type BookerWebWrapperAtomProps = BookerProps

export const BookerWebWrapper = (props: BookerWebWrapperAtomProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const event = useEvent()
  const bookerLayout = useBookerLayout(event.data)

  const selectedDate = searchParams?.get('date')
  const isRedirect = searchParams?.get('redirected') === 'true' || false
  const fromUserNameRedirected = searchParams?.get('username') || ''
  const rescheduleUid =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('rescheduleUid')
      : null
  const bookingUid =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('bookingUid')
      : null
  const date = dayjs(selectedDate).format('YYYY-MM-DD')

  useEffect(() => {
    // This event isn't processed by BookingPageTagManager because BookingPageTagManager hasn't loaded when it is fired. I think we should have a queue in fire method to handle this.
    sdkActionManager?.fire('navigatedToBooker', {})
  }, [])

  useInitializeBookerStore({
    ...props,
    eventId: event?.data?.id,
    rescheduleUid,
    bookingUid: bookingUid,
    layout: bookerLayout.defaultLayout,
    org: props.entity.orgSlug,
  })

  const [bookerState, _] = useBookerStore(
    (state) => [state.state, state.setState],
    shallow,
  )
  const [dayCount] = useBookerStore(
    (state) => [state.dayCount, state.setDayCount],
    shallow,
  )

  const firstNameQueryParam = searchParams?.get('firstName')
  const lastNameQueryParam = searchParams?.get('lastName')
  const metadata = {}
  const prefillFormParams = useMemo(() => {
    return {
      name:
        searchParams?.get('name') ||
        (firstNameQueryParam
          ? `${firstNameQueryParam} ${lastNameQueryParam}`
          : null),
      guests:
        (searchParams?.getAll('guests') || searchParams?.getAll('guest')) ?? [],
    }
  }, [searchParams, firstNameQueryParam, lastNameQueryParam])

  const bookerForm = useBookingForm({
    event: event.data,
    sessionEmail: 'random-hardcodedemail@email.com',
    sessionUsername: 'random-hardcoded-username',
    sessionName: 'random-hardcoded-name',
    hasSession: true,
    extraOptions: {},
    prefillFormParams,
  })
  const calendars = useCalendars({ hasSession: true })
  const verifyEmail = useVerifyEmail({
    email: bookerForm.formEmail,
    name: bookerForm.formName,
    requiresBookerEmailVerification:
      event?.data?.requiresBookerEmailVerification,
    onVerifyEmail: bookerForm.beforeVerifyEmail,
  })
  const slots = useSlots(event)

  const prefetchNextMonth =
    (bookerLayout.layout === BookerLayouts.WEEK_VIEW &&
      !!bookerLayout.extraDays &&
      dayjs(date).month() !==
        dayjs(date).add(bookerLayout.extraDays, 'day').month()) ||
    (bookerLayout.layout === BookerLayouts.COLUMN_VIEW &&
      dayjs(date).month() !==
        dayjs(date)
          .add(bookerLayout.columnViewExtraDays.current, 'day')
          .month())

  const monthCount =
    ((bookerLayout.layout !== BookerLayouts.WEEK_VIEW &&
      bookerState === 'selecting_time') ||
      bookerLayout.layout === BookerLayouts.COLUMN_VIEW) &&
    dayjs(date).add(1, 'month').month() !==
      dayjs(date).add(bookerLayout.columnViewExtraDays.current, 'day').month()
      ? 2
      : undefined
  /**
   * Prioritize dateSchedule load
   * Component will render but use data already fetched from here, and no duplicate requests will be made
   * */
  const schedule = useScheduleForEvent({
    prefetchNextMonth,
    username: props.username,
    monthCount,
    dayCount,
    eventSlug: props.eventSlug,
    month: props.month,
    duration: props.duration,
    selectedDate,
    bookerEmail: bookerForm.formEmail,
  })
  const bookings = useBookings({
    event,
    hashedLink: props.hashedLink,
    bookingForm: bookerForm.bookingForm,
    metadata: metadata ?? {},
    teamMemberEmail: schedule.data?.teamMember,
  })

  const verifyCode = useVerifyCode({
    onSuccess: () => {
      verifyEmail.setVerifiedEmail(bookerForm.formEmail)
      verifyEmail.setEmailVerificationModalVisible(false)
      bookings.handleBookEvent()
    },
  })

  // Toggle query param for overlay calendar
  const onOverlaySwitchStateChange = useCallback(
    (state: boolean) => {
      const current = new URLSearchParams(
        Array.from(searchParams?.entries() ?? []),
      )
      if (state) {
        current.set('overlayCalendar', 'true')
        localStorage.setItem('overlayCalendarSwitchDefault', 'true')
      } else {
        current.delete('overlayCalendar')
        localStorage.removeItem('overlayCalendarSwitchDefault')
      }
      // cast to string
      const value = current.toString()
      const query = value ? `?${value}` : ''
      router.push(`${pathname}${query}`)
    },
    [searchParams, pathname, router],
  )
  useBrandColors({
    brandColor: event.data?.profile.brandColor ?? DEFAULT_LIGHT_BRAND_COLOR,
    darkBrandColor:
      event.data?.profile.darkBrandColor ?? DEFAULT_DARK_BRAND_COLOR,
    theme: event.data?.profile.theme,
  })

  return (
    <BookerComponent
      {...props}
      onGoBackInstantMeeting={() => {
        if (pathname) window.location.href = pathname
      }}
      onConnectNowInstantMeeting={() => {
        const newPath = `${pathname}?isInstantMeeting=true`
        router.push(newPath)
      }}
      onOverlayClickNoCalendar={() => {
        router.push('/apps/categories/calendar')
      }}
      onClickOverlayContinue={() => {
        const currentUrl = new URL(window.location.href)
        currentUrl.pathname = '/login/'
        currentUrl.searchParams.set('callbackUrl', window.location.pathname)
        currentUrl.searchParams.set('overlayCalendar', 'true')
        router.push(currentUrl.toString())
      }}
      onOverlaySwitchStateChange={onOverlaySwitchStateChange}
      sessionUsername={'hardcoded-username'}
      isRedirect={isRedirect}
      fromUserNameRedirected={fromUserNameRedirected}
      rescheduleUid={rescheduleUid}
      bookingUid={bookingUid}
      hasSession={true}
      extraOptions={{}}
      bookings={bookings}
      calendars={calendars}
      slots={slots}
      verifyEmail={verifyEmail}
      bookerForm={bookerForm}
      event={event}
      bookerLayout={bookerLayout}
      schedule={schedule}
      verifyCode={verifyCode}
      isPlatform={false}
    />
  )
}
