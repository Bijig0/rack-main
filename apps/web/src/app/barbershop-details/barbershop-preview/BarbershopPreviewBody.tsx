'use client'
import { useDashboardContext } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import AddressSearch from '@/components/AddressSearch'
import InstagramIcon from '@/components/InstagramIcon'
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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { barbershopsKeys, queryClient } from '@/providers/ReactQueryProvider'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { useWizard } from 'react-use-wizard'
import deleteInstagramInfo from '../barber-info/deleteInstagramInfo'
import updateBarbershopPreviewDetails from './update-barbershop-preview-details'

export type BarbershopPreviewFormValues = {
  latitude?: number
  longitude?: number
  placeId?: string
  mapsUrl?: string
  formattedAddress: string
  brand: string
  tagline: string
  instagramHandle?: string
}

type Props = {
  onCancel?: () => void
  onSubmit?: () => void
}

const BarbershopPreviewBody = (props: Props) => {
  const { onCancel } = props
  const { barbershopDetails } = useDashboardContext()

  const { name, tagline, exact_address } = barbershopDetails

  const form = useForm<BarbershopPreviewFormValues>({
    values: {
      brand: name!,
      tagline: tagline!,
      formattedAddress: exact_address!,
      instagramHandle: barbershopDetails.social_media?.handle ?? '',
    },
  })

  const { toast } = useToast()

  const [isSavingChanges, startIsSavingChangesTransition] = useTransition()

  function onSubmit(values: BarbershopPreviewFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    const createToUpdateValues = (values: BarbershopPreviewFormValues) => {
      const isAddressChanged = values.latitude !== undefined

      console.log({ isAddressChanged })

      const toSendValues = isAddressChanged
        ? {
            general_location: `POINT(${values.longitude} ${values.latitude})`,
            place_id: values.placeId,
            address_url: values.mapsUrl,
            exact_address: values.formattedAddress,
            name: values.brand,
            tagline: values.tagline,
          }
        : {
            name: values.brand,
            tagline: values.tagline,
          }
      return toSendValues
    }

    const barbershopPreview = createToUpdateValues(values)

    startIsSavingChangesTransition(async () => {
      try {
        await updateBarbershopPreviewDetails(barbershopPreview)
        toast({
          variant: 'success',
          title: 'Your changes have been saved',
        })
        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
        props.onSubmit?.()
      } catch (error) {
        console.log({ error })
      }
    })
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const [isDisconnectingInstagram, startIsDisconnectingInstagram] =
    useTransition()

  const handleDisconnectInstagram = () => {
    startIsDisconnectingInstagram(async () => {
      try {
        await deleteInstagramInfo(barbershopDetails.id)
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

  const { nextStep } = useWizard()

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* <FormItem>
            <FormLabel>Social Media</FormLabel>
            <div className="flex items-center justify-start gap-2">
              <InstagramIcon size={18} />
              <Button className="flex items-center h-8 text-xs rounded-2xl hover:opacity-80">
                Connect
              </Button>
            </div>
          </FormItem> */}
          <FormItem>
            <FormLabel>Social Media</FormLabel>
            <div className="flex items-center justify-start gap-2">
              <InstagramIcon className="w-4 h-4" />
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
                  onClick={nextStep}
                  className="flex items-center h-8 text-xs rounded-2xl hover:opacity-80"
                >
                  Connect
                </Button>
              )}
            </div>
          </FormItem>

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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <BaseInput {...field} placeholder="TaperAU" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="THE platform to connect barbers with customers"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-x-2">
            <Button variant="save-changes" type="submit">
              {isSavingChanges ? (
                <LoadingSpinner className="w-4 h-4 mx-auto" />
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button type="button" variant="done" onClick={handleCancel}>
              Done
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default BarbershopPreviewBody
