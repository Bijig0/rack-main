'use client'
import { useDashboardContext } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { useErrorContext } from '@/app/error-context'
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
import updateAbout from './updateAbout'

type BarbershopPreviewFormValues = {
  about: string
}
type Props = {
  closeModal: () => void
}

const AboutEditModeDialogBody = (props: Props) => {
  const { closeModal } = props
  const { barbershopDetails } = useDashboardContext()

  console.log({ about: barbershopDetails.about })

  const form = useForm<BarbershopPreviewFormValues>({
    values: {
      about: barbershopDetails.about ?? '',
    },
  })
  const [isSubmitting, startIsSubmittingTransition] = useTransition()
  const { toast } = useToast()
  const { handleGenericError } = useErrorContext()

  function onSubmit(values: BarbershopPreviewFormValues) {
    startIsSubmittingTransition(async () => {
      try {
        await updateAbout(values.about, barbershopDetails.id)
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
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="about"
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Textarea placeholder="The greatest" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-x-2">
            <Button variant="save-changes" type="submit">
              {isSubmitting ? (
                <LoadingSpinner className="mx-auto h-4 w-4" />
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button variant="done" type="button" onClick={closeModal}>
              Done
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AboutEditModeDialogBody
