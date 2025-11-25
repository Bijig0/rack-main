'use client'
import { useDashboardContext } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { useErrorContext } from '@/app/error-context'
import { BaseInput } from '@/components/ui/base-input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { barbershopsKeys, queryClient } from '@/providers/ReactQueryProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { InstagramIcon } from 'lucide-react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { useWizard } from 'react-use-wizard'
import { z } from 'zod'
import AddressSearch from '../../../components/AddressSearch'
import deleteInstagramInfo from './deleteInstagramInfo'
import updateBarbershopInfo from './updateBarbershopInfo'

const barbershopInfoFormValuesSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  placeId: z.string().optional(),
  mapsUrl: z.string().optional(),
  formattedAddress: z.string().optional(),
  bookingWebsite: z
    .string()
    .refine(
      (value) =>
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(
          value,
        ),
      {
        message: 'Must be a valid URL',
      },
    )
    .optional(),
  instagramHandle: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export type BarbershopInfoFormValues = z.infer<
  typeof barbershopInfoFormValuesSchema
>

type Props = {
  closeEditModeDialog: () => void
}

const BarbershopInfoEditModeDialogBody = (props: Props) => {
  const { closeEditModeDialog } = props
  const { nextStep } = useWizard()
  const { barbershopDetails } = useDashboardContext()

  const barbershopId = barbershopDetails.id

  const form = useForm<BarbershopInfoFormValues>({
    resolver: zodResolver(barbershopInfoFormValuesSchema),
    values: {
      firstName: barbershopDetails.user_profile?.first_name ?? '',
      lastName: barbershopDetails.user_profile?.last_name ?? '',
      formattedAddress: barbershopDetails.exact_address!,
      bookingWebsite: barbershopDetails.booking_url ?? '',
      instagramHandle: barbershopDetails.social_media?.handle ?? '',
    },
  })
  const [isSubmitting, startIsSubmittingTransition] = useTransition()
  const { toast } = useToast()
  const { handleGenericError } = useErrorContext()

  function onSubmit(values: BarbershopInfoFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    const addHttps = (url: string) => {
      const cleanedUrl = url.indexOf('://') === -1 ? 'https://' + url : url
      return cleanedUrl
    }

    const createToUpdateValues = (values: BarbershopInfoFormValues) => {
      const cleanedBookingWebsite = values.bookingWebsite
        ? addHttps(values.bookingWebsite)
        : values.bookingWebsite

      const cleanedValues = {
        ...values,
        bookingWebsite: cleanedBookingWebsite,
      }

      const isAddressChanged = values.latitude !== undefined

      console.log({ isAddressChanged })

      const toSendValues = isAddressChanged
        ? {
            general_location: `POINT(${values.longitude} ${values.latitude})`,
            place_id: values.placeId,
            address_url: values.mapsUrl,
            exact_address: values.formattedAddress,
            booking_url: cleanedBookingWebsite,
          }
        : {
            booking_url: cleanedBookingWebsite,
          }
      return toSendValues
    }

    const barbershopInfo = createToUpdateValues(values)

    console.log({ barbershopInfo })

    startIsSubmittingTransition(async () => {
      try {
        await updateBarbershopInfo({ ...barbershopInfo, barbershopId })
        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your changes have been saved',
        })
      } catch (error) {
        if (error instanceof Error) {
          handleGenericError(error)
        }
      }
    })
  }

  const [isDisconnectingInstagram, startIsDisconnectingInstagram] =
    useTransition()

  const handleDisconnectInstagram = () => {
    startIsDisconnectingInstagram(async () => {
      try {
        await deleteInstagramInfo(barbershopId)
        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
        toast({
          variant: 'destructive',
          description: 'Your Instagram account has been disconnected',
        })
      } catch (error) {
        if (error instanceof Error) {
          toast({
            variant: 'destructive',
            title: 'Uh oh, something went wrong',
            description: error.message,
          })
        }
      }
    })
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>Social Media</FormLabel>
            <div className="flex items-center justify-start gap-2">
              <InstagramIcon size={18} />
              {barbershopDetails?.social_media?.handle ? (
                <div className="flex items-center gap-2">
                  <p className="relative underline text-md">
                    @{barbershopDetails.social_media.handle}
                    <span className="absolute right-0 text-xs top-6 whitespace-nowrap">
                      (Followers refeshes weekly)
                    </span>
                  </p>
                  <Button
                    type="button"
                    onClick={handleDisconnectInstagram}
                    className="flex items-center h-8 text-xs rounded-2xl hover:opacity-80"
                  >
                    {isDisconnectingInstagram ? (
                      <LoadingSpinner className="w-4 h-4 mx-auto" />
                    ) : (
                      'Disconnect'
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center h-8 text-xs rounded-2xl hover:opacity-80"
                >
                  Connect
                </Button>
              )}
            </div>
          </FormItem>

          {/* <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <BaseInput {...field} placeholder="John" />
                </FormControl>
                {form.formState.errors.firstName && (
                  <FormMessage className="text-red-600">
                    {form.formState.errors.firstName.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <BaseInput {...field} placeholder="Doe" />
                </FormControl>
                {form.formState.errors.lastName && (
                  <FormMessage className="text-red-600">
                    {form.formState.errors.lastName.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="formattedAddress"
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address/Region</FormLabel>
                <FormControl>
                  <AddressSearch
                    {...field}
                    afterSelect={(placeDetails) => {
                      form.setValue(
                        'latitude',
                        placeDetails.geometry.location.lat() as number,
                      )
                      form.setValue(
                        'longitude',
                        placeDetails.geometry.location.lng() as number,
                      )
                      form.setValue('placeId', placeDetails.place_id)
                      form.setValue('mapsUrl', placeDetails.url)
                    }}
                  />
                </FormControl>
                {form.formState.errors.formattedAddress && (
                  <FormMessage className="text-red-600">
                    {form.formState.errors.formattedAddress.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookingWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Booking Website</FormLabel>
                <FormControl>
                  <BaseInput placeholder="www.google.com" {...field} />
                </FormControl>
                {form.formState.errors.bookingWebsite && (
                  <FormMessage className="text-red-600">
                    {form.formState.errors.bookingWebsite.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <div className="space-x-2">
            <Button variant="save-changes" type="submit">
              {isSubmitting ? (
                <LoadingSpinner className="w-4 h-4 mx-auto" />
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button variant="done" type="button" onClick={closeEditModeDialog}>
              Done
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default BarbershopInfoEditModeDialogBody
