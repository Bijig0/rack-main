'use client'
import {
  BarbershopDetails,
  useDashboardContext,
} from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { useErrorContext } from '@/app/error-context'
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
import DeleteCutButton from './DeleteCutButton'
import createCutInfo from './createCutInfo'
import deleteCutInfo from './deleteCutInfo'
import insertHairCutMediaUrl from './insertHairCutMediaUrl'
import updateCutInfo from './updateCutInfo'

type _CutInfoFormValues = Omit<
  Tables<'haircut_details'>,
  'id' | 'created_at' | 'barbershop_details_id' | 'is_featured'
>

type CutInfoFormValues = {
  [K in keyof _CutInfoFormValues]: Exclude<_CutInfoFormValues[K], null>
} & {
  images?: File[]
}

type Props = {
  closeModal: () => void
  selectedCutId: number | undefined
  setSelectedCutId: (cutId: number | undefined) => void
}

const getHairCutDetails = (
  barbershopDetails: BarbershopDetails,
  cutId: number | undefined,
): {
  haircutGallery: {
    image_url: string
  }[]
  haircutDetailsGalleryId: number | undefined
  name: string
  price: number | undefined
  details: string
  haircutDetailsId: number | undefined
} => {
  if (cutId === undefined)
    return {
      haircutGallery: [],
      haircutDetailsGalleryId: undefined,
      name: '',
      price: undefined,
      details: '',
      haircutDetailsId: undefined,
    }

  console.log({ cutId, barbershopDetails })

  const selectedCutDetails = barbershopDetails.haircut_details.find(
    (haircutDetail) => haircutDetail.id === cutId,
  )!
  const haircutDetailsGalleryId = selectedCutDetails.haircut_details_gallery!.id

  const haircutGallery =
    selectedCutDetails.haircut_details_gallery!.haircut_details_gallery_image
  return {
    haircutGallery,
    haircutDetailsGalleryId,
    name: selectedCutDetails.name!,
    price: selectedCutDetails.price!,
    details: selectedCutDetails.details!,
    haircutDetailsId: selectedCutDetails.id,
  }
}

const CutInfo = (props: Props) => {
  const { previousStep } = useWizard()

  const { selectedCutId, closeModal, setSelectedCutId } = props

  const { barbershopDetails } = useDashboardContext()

  const { id: barbershopId } = barbershopDetails

  const isExistingCut = selectedCutId !== undefined

  console.log({ isExistingCut })

  const {
    haircutGallery,
    haircutDetailsGalleryId,
    haircutDetailsId,
    name,
    price,
    details,
  } = getHairCutDetails(barbershopDetails, selectedCutId)

  const form = useForm<CutInfoFormValues>({
    values: {
      name: name,
      price: price!,
      details: details,
    },
  })

  const noHaircuts = haircutGallery.length === 0

  const [isUploadingNewMedia, startIsUploadingNewMedia] = useTransition()

  const [isSavingChanges, startIsSavingChanges] = useTransition()

  const { toast } = useToast()
  const { handleGenericError } = useErrorContext()

  const handleUpload = async (files: File[], order: number) => {
    // The file uploader sends the files as an array of files, but we only want one file
    const basePath = createGalleryBasePath(barbershopId)
    const file = files[0]!
    const path = `${basePath}/${file.name}`

    startIsUploadingNewMedia(async () => {
      try {
        console.log('Uploading file')
        await uploadFile({ path, file })

        await insertHairCutMediaUrl(haircutDetailsGalleryId!, [path], order)
        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your images have been uploaded',
        })
      } catch (error) {
        if (error instanceof Error) {
          handleGenericError(error)
        }
      }
    })
  }

  const addNewCut = async (data: CutInfoFormValues) => {
    const shouldBeFeatured = barbershopDetails.haircut_details.length === 0
    const { name, price, details } = data
    const { id: hairCutDetailsGalleryId } = await createCutInfo(
      barbershopId,
      name,
      price,
      details,
      shouldBeFeatured,
    )

    const basePath = createGalleryBasePath(barbershopId)
    const image = form.watch('images')?.[0]
    if (image) {
      const path = `${basePath}/${image.name}`

      await uploadFile({ path, file: image })

      console.log({ hairCutDetailsGalleryId })

      await insertHairCutMediaUrl(hairCutDetailsGalleryId, [path], 1)
    }
  }

  const updateExistingCut = async (data: CutInfoFormValues) => {
    const { name, price, details } = data
    await updateCutInfo(haircutDetailsId!, name, price, details)
  }

  const onSaveChanges = async (data: CutInfoFormValues) => {
    const action = isExistingCut ? updateExistingCut : addNewCut
    startIsSavingChanges(async () => {
      try {
        await action(data)

        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your changes have been saved',
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

  const nextImageOrder = haircutGallery.length + 1

  const renderPreviewImages = () => {
    if (!isExistingCut) return null
    return noHaircuts ? (
      <img className="rounded-xl" src={PLACEHOLDER_IMAGE_URL} />
    ) : (
      haircutGallery.map(({ image_url }, index) => (
        <img key={image_url} className="rounded-xl" src={image_url} />
      ))
    )
  }

  const [isDeletingCut, startIsDeletingCut] = useTransition()

  const handleDeleteCut = () => {
    startIsDeletingCut(async () => {
      try {
        await deleteCutInfo(haircutDetailsId!)
        previousStep()
        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your changes have been saved',
        })
        setSelectedCutId(undefined)
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
            {isExistingCut ? (
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
                <FormLabel>Cut Name</FormLabel>
                <FormControl>
                  <BaseInput placeholder="Low Taper Fade" {...field} />
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
                    placeholder="A really cool cut"
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
                  <LoadingSpinner className="mx-auto h-4 w-4" />
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button variant="done" type="button" onClick={closeModal}>
                Done
              </Button>
            </div>
            <DeleteCutButton
              isDeletingCut={isDeletingCut}
              onDeleteCut={handleDeleteCut}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CutInfo
