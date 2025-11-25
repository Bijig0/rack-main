'use client'
import {
  BarbershopDetails,
  useDashboardContext,
} from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { PLACEHOLDER_IMAGE_URL } from '@/app/globals'
import { Tables } from '@/app/types/supabase'
import { FileUploader } from '@/components/FileUpload'
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
import uploadFile from '@/utils/uploadFile'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { useWizard } from 'react-use-wizard'
import createGalleryBasePath from '../barbershop-gallery/createGalleryBasePath'
import DeleteAddOnButton from './DeleteAddOnButton'
import createAddOnInfo from './createAddOnInfo'
import deleteAddOnInfo from './deleteAddOnInfo'
import insertAddOnMediaUrl from './insertAddOnMediaUrl'
import updateAddOnInfo from './updateAddOnInfo'

type _AddOnInfoFormValues = Omit<
  Tables<'addon_details'>,
  'id' | 'created_at' | 'barbershop_details_id' | 'is_featured'
>

type AddOnInfoFormValues = {
  [K in keyof _AddOnInfoFormValues]: Exclude<_AddOnInfoFormValues[K], null>
} & {
  images?: File[]
}

type Props = {
  closeModal: () => void
  selectedAddOnId: number | undefined
  setSelectedAddOnId: (addOnId: number | undefined) => void
}

const getAddOnDetails = (
  barbershopDetails: BarbershopDetails,
  addOnId: number | undefined,
): {
  addOnGallery: {
    image_url: string
  }[]
  addOnDetailsGalleryId: number | undefined
  name: string
  price: number | undefined
  details: string
  addOnDetailsId: number | undefined
} => {
  if (addOnId === undefined)
    return {
      addOnGallery: [],
      addOnDetailsGalleryId: undefined,
      name: '',
      price: undefined,
      details: '',
      addOnDetailsId: undefined,
    }

  console.log({ addOnId, barbershopDetails })

  const selectedAddOnDetails = barbershopDetails.addon_details.find(
    (addonDetails) => addonDetails.id === addOnId,
  )!
  const addOnDetailsGalleryId = selectedAddOnDetails.addon_details_gallery!.id

  const addOnGallery =
    selectedAddOnDetails.addon_details_gallery!.addon_details_gallery_image
  return {
    addOnGallery,
    addOnDetailsGalleryId,
    name: selectedAddOnDetails.name!,
    price: selectedAddOnDetails.price!,
    details: selectedAddOnDetails.details!,
    addOnDetailsId: selectedAddOnDetails.id,
  }
}

const AddOnInfo = (props: Props) => {
  const { previousStep } = useWizard()

  const { selectedAddOnId, closeModal, setSelectedAddOnId } = props

  const { barbershopDetails } = useDashboardContext()

  const { id: barbershopId } = barbershopDetails

  const isExistingAddOn = selectedAddOnId !== undefined

  console.log({ isExistingAddOn })

  const {
    addOnGallery,
    addOnDetailsGalleryId,
    addOnDetailsId,
    name,
    price,
    details,
  } = getAddOnDetails(barbershopDetails, selectedAddOnId)

  const form = useForm<AddOnInfoFormValues>({
    values: {
      name: name,
      price: price!,
      details: details,
    },
  })

  const noAddOns = addOnGallery.length === 0

  const [isUploadingNewMedia, startIsUploadingNewMedia] = useTransition()

  const [isSavingChanges, startIsSavingChanges] = useTransition()

  const { toast } = useToast()

  const handleUpload = async (files: File[], order: number) => {
    // The file uploader sends the files as an array of files, but we only want one file
    const basePath = createGalleryBasePath(barbershopId)
    const file = files[0]!
    const path = `${basePath}/${file.name}`

    startIsUploadingNewMedia(async () => {
      try {
        console.log('Uploading file')
        await uploadFile({ path, file })

        await insertAddOnMediaUrl(addOnDetailsGalleryId!, [path], order)
        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your images have been uploaded',
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

  const addNewAddOn = async (data: AddOnInfoFormValues) => {
    const { name, price, details } = data
    const { id: addOnDetailsGalleryId } = await createAddOnInfo(
      barbershopId,
      name,
      price,
      details,
    )

    const basePath = createGalleryBasePath(barbershopId)
    const image = form.watch('images')?.[0]
    if (image) {
      const path = `${basePath}/${image.name}`

      await uploadFile({ path, file: image })

      console.log({ addOnDetailsGalleryId })

      await insertAddOnMediaUrl(addOnDetailsGalleryId, [path], 1)
    }
  }

  const updateExistingAddOn = async (data: AddOnInfoFormValues) => {
    const { name, price, details } = data
    await updateAddOnInfo(addOnDetailsId!, name, price, details)
  }

  const onSaveChanges = async (data: AddOnInfoFormValues) => {
    const action = isExistingAddOn ? updateExistingAddOn : addNewAddOn
    startIsSavingChanges(async () => {
      try {
        await action(data)

        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your changes have been saved',
        })
        previousStep()
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

  const nextImageOrder = addOnGallery.length + 1

  const renderPreviewImages = () => {
    if (!isExistingAddOn) return null
    return noAddOns ? (
      <img className="rounded-xl" src={PLACEHOLDER_IMAGE_URL} />
    ) : (
      addOnGallery.map(({ image_url }, index) => (
        <img key={image_url} className="rounded-xl" src={image_url} />
      ))
    )
  }

  const [isDeletingAddOn, startIsDeletingAddOn] = useTransition()

  const handleDeleteAddOn = () => {
    startIsDeletingAddOn(async () => {
      try {
        await deleteAddOnInfo(addOnDetailsId!)
        previousStep()
        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your changes have been saved',
        })
        setSelectedAddOnId(undefined)
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
    <div className="space-y-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSaveChanges)} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {renderPreviewImages()}
            </div>
            {isExistingAddOn ? (
              <FileUploader
                containerClassName="h-full lg:flex-[3_3_0%]"
                className="h-full"
                maxFiles={1}
                maxSize={8 * 1024 * 1024}
                onUpload={(files) => handleUpload(files, nextImageOrder)}
                disabled={isUploadingNewMedia}
              />
            ) : (
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploader
                        containerClassName="h-full lg:flex-[3_3_0%]"
                        className="h-full"
                        maxFiles={1}
                        maxSize={8 * 1024 * 1024}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isUploadingNewMedia}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormField
            control={form.control}
            name="name"
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add On Name</FormLabel>
                <FormControl>
                  <BaseInput placeholder="Beard trim" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <BaseInput type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <BaseInput
                    type="text"
                    placeholder="A really cool brow trim"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button variant="save-changes" type="submit">
                {isSavingChanges ? (
                  <LoadingSpinner className="w-4 h-4 mx-auto" />
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button variant="done" type="button" onClick={closeModal}>
                Done
              </Button>
            </div>
            <DeleteAddOnButton
              isDeletingAddOn={isDeletingAddOn}
              onDeleteAddOn={handleDeleteAddOn}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AddOnInfo
