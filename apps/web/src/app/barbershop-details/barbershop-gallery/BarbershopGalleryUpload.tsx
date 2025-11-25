import { FileUploader } from '@/components/FileUpload'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/spinner'

type Props = {
  onUploadNewGenericCutMedia: () => void
  isUploadingNewMedia: boolean
  form: any
}

const BarbershopGalleryUpload = (props: Props) => {
  const { onUploadNewGenericCutMedia, isUploadingNewMedia, form } = props
  return (
    <FormField
      control={form.control}
      name="images"
      rules={{ required: 'This field is required' }}
      render={({ field }) => (
        <FormItem className="p-0">
          <FormLabel className="p-0 cursor-pointer">
            Upload new cut media
          </FormLabel>
          <FormControl>
            <FileUploader
              value={field.value}
              onValueChange={field.onChange}
              maxFiles={1}
              maxSize={4 * 1024 * 1024}
              disabled={isUploadingNewMedia}
            />
          </FormControl>
          <Button onClick={onUploadNewGenericCutMedia} type="button">
            {isUploadingNewMedia ? (
              <LoadingSpinner className="w-4 h-4 mx-auto" />
            ) : (
              'Save'
            )}
          </Button>
        </FormItem>
      )}
    />
  )
}

export default BarbershopGalleryUpload
