import Link from 'next/link'
import { useState } from 'react'
import { Form, type FieldError } from 'react-hook-form'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TFunction } from 'sanity'
import { BookerEvent } from '../../../types'
import { useBookerStore } from '../../store'
import type { UseBookingFormReturnType } from '../hooks/useBookingForm'
import type {
  IUseBookingErrors,
  IUseBookingLoadingStates,
} from '../hooks/useBookings'
import { BookingFields } from './BookingFields'
import { FormSkeleton } from './Skeleton'

type BookEventFormProps = {
  onCancel?: () => void
  onSubmit: () => void
  errorRef: React.RefObject<HTMLDivElement>
  errors: UseBookingFormReturnType['errors'] & IUseBookingErrors
  loadingStates: IUseBookingLoadingStates
  children?: React.ReactNode
  bookingForm: UseBookingFormReturnType['bookingForm']
  renderConfirmNotVerifyEmailButtonCond: boolean
  extraOptions: Record<string, string | string[]>
  isPlatform?: boolean
}

export const BookEventForm = ({
  onCancel,
  eventQuery,
  rescheduleUid,
  onSubmit,
  errorRef,
  errors,
  loadingStates,
  renderConfirmNotVerifyEmailButtonCond,
  bookingForm,
  children,
  extraOptions,
  isPlatform = false,
}: Omit<BookEventFormProps, 'event'> & {
  eventQuery: {
    isError: boolean
    isPending: boolean
    data?: Pick<
      BookerEvent,
      'price' | 'currency' | 'metadata' | 'bookingFields' | 'locations'
    > | null
  }
  rescheduleUid: string | null
}) => {
  const eventType = eventQuery.data
  const setFormValues = useBookerStore((state) => state.setFormValues)
  const bookingData = useBookerStore((state) => state.bookingData)
  const timeslot = useBookerStore((state) => state.selectedTimeslot)
  const username = useBookerStore((state) => state.username)
  const isInstantMeeting = useBookerStore((state) => state.isInstantMeeting)

  const [responseVercelIdHeader] = useState<string | null>(null)

  // const isPaidEvent = useMemo(() => {
  //   if (!eventType?.price) return false
  //   const paymentAppData = getPaymentAppData(eventType)
  //   return (
  //     eventType?.price > 0 &&
  //     !Number.isNaN(paymentAppData.price) &&
  //     paymentAppData.price > 0
  //   )
  // }, [eventType])

  const isPaidEvent = true

  if (eventQuery.isError)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
    )
  if (eventQuery.isPending || !eventQuery.data) return <FormSkeleton />
  if (!timeslot)
    return (
      <p>Empty Screen</p>
      // <EmptyScreen
      //   headline={t('timeslot_missing_title')}
      //   description={t('timeslot_missing_description')}
      //   Icon="calendar"
      //   buttonText={t('timeslot_missing_cta')}
      //   buttonOnClick={onCancel}
      // />
    )

  if (!eventType) {
    console.warn('No event type found for event', extraOptions)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Form
        className="flex flex-col h-full"
        onChange={() => {
          // Form data is saved in store. This way when user navigates back to
          // still change the timeslot, and comes back to the form, all their values
          // still exist. This gets cleared when the form is submitted.
          const values = bookingForm.getValues()
          setFormValues(values)
        }}
        form={bookingForm}
        handleSubmit={onSubmit}
        noValidate
      >
        <BookingFields
          isDynamicGroupBooking={!!(username && username.indexOf('+') > -1)}
          fields={eventType.bookingFields}
          locations={eventType.locations}
          rescheduleUid={rescheduleUid || undefined}
          bookingData={bookingData}
        />
        {(errors.hasFormErrors || errors.hasDataErrors) && (
          <div data-testid="booking-fail">
            <Alert
              ref={errorRef}
              className="my-2"
              variant="default"
              title={rescheduleUid ? 'reschedule fail' : 'booking fail'}
              message={getError(
                errors.formErrors,
                errors.dataErrors,
                t,
                responseVercelIdHeader,
              )}
            />
          </div>
        )}
        {
          <div className="w-full my-3 text-xs text-subtle opacity-80">
            <Link
              className="text-emphasis hover:underline"
              key="terms"
              href={`/terms`}
              target="_blank"
            >
              Terms
            </Link>
            <Link
              className="text-emphasis hover:underline"
              key="privacy"
              href={`/privacy`}
              target="_blank"
            >
              Privacy Policy.
            </Link>
          </div>
        }
        <div className="flex justify-end mt-auto space-x-2 modalsticky rtl:space-x-reverse">
          {isInstantMeeting ? (
            <Button
              type="submit"
              color="primary"
              loading={loadingStates.creatingInstantBooking}
            >
              {isPaidEvent ? t('pay_and_book') : t('confirm')}
            </Button>
          ) : (
            <>
              {!!onCancel && (
                <Button
                  color="minimal"
                  type="button"
                  onClick={onCancel}
                  data-testid="back"
                >
                  {t('back')}
                </Button>
              )}
              <Button
                type="submit"
                color="primary"
                loading={
                  loadingStates.creatingBooking ||
                  loadingStates.creatingRecurringBooking
                }
                data-testid={
                  rescheduleUid && bookingData
                    ? 'confirm-reschedule-button'
                    : 'confirm-book-button'
                }
              >
                {rescheduleUid && bookingData
                  ? t('reschedule')
                  : renderConfirmNotVerifyEmailButtonCond
                    ? isPaidEvent
                      ? t('pay_and_book')
                      : t('confirm')
                    : t('verify_email_email_button')}
              </Button>
            </>
          )}
        </div>
      </Form>
      {children}
    </div>
  )
}

const getError = (
  globalError: FieldError | undefined,
  // It feels like an implementation detail to reimplement the types of useMutation here.
  // Since they don't matter for this function, I'd rather disable them then giving you
  // the cognitive overload of thinking to update them here when anything changes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataError: any,
  t: TFunction,
  responseVercelIdHeader: string | null,
) => {
  if (globalError) return globalError?.message

  const error = dataError

  return error?.message ? (
    <>
      {responseVercelIdHeader ?? ''} {t(error.message)}
    </>
  ) : (
    <>{t('can_you_try_again')}</>
  )
}
