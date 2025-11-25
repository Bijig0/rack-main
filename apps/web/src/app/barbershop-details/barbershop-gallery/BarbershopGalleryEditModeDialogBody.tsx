import { useDashboardContext } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { PLACEHOLDER_IMAGE_URL } from '@/app/globals'
import { Tables } from '@/app/types/supabase'
import { FileUploader } from '@/components/FileUpload'
import { Button } from '@/components/ui/button'
import { Form, FormLabel } from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { barbershopsKeys, queryClient } from '@/providers/ReactQueryProvider'
import uploadFile from '@/utils/uploadFile'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { MdDeleteOutline } from 'react-icons/md'
import BarbershopGallery from './BarbershopGallery'
import BarbershopGalleryMainImage from './BarbershopGalleryMainImage'
import BarbershopGallerySubImage from './BarbershopGallerySubImage'
import createGalleryBasePath from './createGalleryBasePath'
import insertImageUrls from './insertImageUrls'
import removeGalleryImages from './removeGalleryImages'

export type GalleryImageType = Exclude<
  keyof Tables<'barbershop_gallery'>,
  'created_at' | 'id' | 'updated_at' | 'barbershop_details_id'
>

type GalleryFormValues = Record<GalleryImageType, File[]>

type Props = {
  closeModal: () => void
}

const BarbershopGalleryEditModeDialogBody = (props: Props) => {
  const { closeModal } = props
  const { barbershopDetails } = useDashboardContext()

  const { id: barbershopId } = barbershopDetails

  const { main_image, sub_image_one, sub_image_two, sub_image_three } =
    barbershopDetails.barbershop_gallery

  const [imagesToDelete, setImagesToDelete] = useState<GalleryImageType[]>([])

  const resetImagesToDelete = () => {
    setImagesToDelete([])
  }

  const { toast } = useToast()

  const form = useForm<GalleryFormValues>()

  const [isUploadingNewMedia, startIsUploadingNewMedia] = useTransition()

  const [isSavingChanges, startIsSavingChanges] = useTransition()

  const handleSoftDeleteImage = (imageType: GalleryImageType) => {
    console.log({ imageType })
    setImagesToDelete((prev) => [...prev, imageType])
  }

  const handleUpload = async (
    files: File[],
    mediaGalleryType: GalleryImageType,
  ) => {
    // The file uploader sends the files as an array of files, but we only want one file
    const basePath = createGalleryBasePath(barbershopId)
    const file = files[0]!
    const path = `${basePath}/${file.name}`

    startIsUploadingNewMedia(async () => {
      try {
        console.log('Uploading file')
        await uploadFile({ path, file })

        await insertImageUrls(barbershopId, [path], mediaGalleryType)
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

  const onSaveChanges = async () => {
    startIsSavingChanges(async () => {
      try {
        await removeGalleryImages(imagesToDelete, barbershopDetails.id)
        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
        resetImagesToDelete()
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your images have been updated',
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

  const checkSoftDeleted = (imageType: GalleryImageType) => {
    return imagesToDelete.includes(imageType)
  }

  const srcs = [
    main_image,
    sub_image_one,
    sub_image_two,
    sub_image_three,
  ].filter(Boolean) as string[]

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSaveChanges)}>
        <section className="grid gap-4 mx-auto">
          <div className="flex flex-col gap-2">
            <FormLabel>Main Images/Videos</FormLabel>
            <div className="flex flex-wrap justify-between w-full gap-2">
              <BarbershopGallery
                galleryButton={() => null}
                mainImage={() => {
                  const isSoftDeleted = checkSoftDeleted('main_image')
                  return main_image ? (
                    <BarbershopGalleryMainImage
                      src={isSoftDeleted ? PLACEHOLDER_IMAGE_URL : main_image}
                    >
                      {main_image && !isSoftDeleted ? (
                        <Button
                          type="button"
                          onClick={() => handleSoftDeleteImage('main_image')}
                          className="absolute bg-black right-4 top-4 rounded-xl opacity-80"
                        >
                          <MdDeleteOutline size={18} className="text-red-600" />
                        </Button>
                      ) : null}
                    </BarbershopGalleryMainImage>
                  ) : (
                    <FileUploader
                      containerClassName="h-full lg:flex-[3_3_0%]"
                      className="h-full"
                      maxFiles={1}
                      maxSize={32 * 1024 * 1024}
                      onUpload={(files) => handleUpload(files, 'main_image')}
                      disabled={isUploadingNewMedia}
                    />
                  )
                }}
                subImageOne={() => {
                  const isSoftDeleted = checkSoftDeleted('sub_image_one')
                  return sub_image_one ? (
                    <BarbershopGallerySubImage
                      src={
                        isSoftDeleted ? PLACEHOLDER_IMAGE_URL : sub_image_one
                      }
                    >
                      {sub_image_one && !isSoftDeleted ? (
                        <Button
                          type="button"
                          onClick={() => handleSoftDeleteImage('sub_image_one')}
                          className="absolute bg-black right-4 top-4 rounded-xl opacity-80"
                        >
                          <MdDeleteOutline size={18} className="text-red-600" />
                        </Button>
                      ) : null}
                    </BarbershopGallerySubImage>
                  ) : (
                    <FileUploader
                      containerClassName="flex-1"
                      maxFiles={1}
                      maxSize={8 * 1024 * 1024}
                      onUpload={(files) => handleUpload(files, 'sub_image_one')}
                      disabled={isUploadingNewMedia}
                    />
                  )
                }}
                subImageTwo={() => {
                  const isSoftDeleted = checkSoftDeleted('sub_image_two')
                  return sub_image_two ? (
                    <BarbershopGallerySubImage
                      src={
                        isSoftDeleted ? PLACEHOLDER_IMAGE_URL : sub_image_two
                      }
                    >
                      {sub_image_two && !isSoftDeleted ? (
                        <Button
                          type="button"
                          onClick={() => handleSoftDeleteImage('sub_image_two')}
                          className="absolute bg-black right-4 top-4 rounded-xl opacity-80"
                        >
                          <MdDeleteOutline size={18} className="text-red-600" />
                        </Button>
                      ) : null}
                    </BarbershopGallerySubImage>
                  ) : (
                    <FileUploader
                      containerClassName="flex-1"
                      maxFiles={1}
                      maxSize={8 * 1024 * 1024}
                      onUpload={(files) => handleUpload(files, 'sub_image_two')}
                      disabled={isUploadingNewMedia}
                    />
                  )
                }}
                subImageThree={() => {
                  const isSoftDeleted = checkSoftDeleted('sub_image_three')
                  return sub_image_three ? (
                    <BarbershopGallerySubImage
                      src={
                        isSoftDeleted ? PLACEHOLDER_IMAGE_URL : sub_image_three
                      }
                    >
                      {sub_image_three && !isSoftDeleted ? (
                        <Button
                          type="button"
                          onClick={() =>
                            handleSoftDeleteImage('sub_image_three')
                          }
                          className="absolute bg-black right-4 top-4 rounded-xl opacity-80"
                        >
                          <MdDeleteOutline size={18} className="text-red-600" />
                        </Button>
                      ) : null}
                    </BarbershopGallerySubImage>
                  ) : (
                    <FileUploader
                      containerClassName="flex-1"
                      maxFiles={1}
                      maxSize={8 * 1024 * 1024}
                      onUpload={(files) =>
                        handleUpload(files, 'sub_image_three')
                      }
                      disabled={isUploadingNewMedia}
                    />
                  )
                }}
              />

              {/* {displayedImages.map(
                ({ image: displayedImage, imageType, show }, index) => {
                  const isMain = index === 0
                  if (!show) return null
                  return (
                    <div
                      className={cn(
                        'relative flex-[1_1_45%] cursor-pointer rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-75',
                        isMain && 'border-2 border-solid border-blue-600 p-1',
                      )}
                    >
                      <Card className="relative border-none">
                        <CardContent className="p-0 border-none">
                          <img
                            className="rounded-xl"
                            src={displayedImage ?? PLACEHOLDER_IMAGE_URL}
                          />
                        </CardContent>
                      </Card>
                      <Badge
                        className={cn(
                          'absolute left-4 top-4 bg-blue-600',
                          !isMain && 'hidden',
                        )}
                      >
                        Main
                      </Badge>
                      {displayedImage ? (
                        <Button
                          type="button"
                          onClick={() => handleSoftDeleteImage(imageType)}
                          className="absolute bg-transparent right-4 top-4 rounded-xl hover:opacity-80"
                        >
                          <MdDeleteOutline size={18} className="text-red-600" />
                        </Button>
                      ) : null}
                    </div>
                  )
                },
              )} */}
            </div>

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
          </div>
        </section>
      </form>
    </Form>
  )
}

export default BarbershopGalleryEditModeDialogBody
