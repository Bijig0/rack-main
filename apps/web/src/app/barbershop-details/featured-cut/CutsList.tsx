import { useDashboardContext } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { Button, buttonVariants } from '@/components/ui/button'
import { Form, FormField, FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { barbershopsKeys, queryClient } from '@/providers/ReactQueryProvider'
import { cn } from '@/utils/tailwind'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { useWizard } from 'react-use-wizard'
import updateFeaturedCut from './updateFeaturedCut'

type Props = {
  setSelectedCutId: (cutId: number | undefined) => void
}

type FormValues = {
  isFeatured: string
}

const CutsList = (props: Props) => {
  const { setSelectedCutId } = props
  const { nextStep } = useWizard()
  const handleViewMoreInfo = (cutId: number) => {
    setSelectedCutId(cutId)
    nextStep()
  }

  const { barbershopDetails } = useDashboardContext()
  const featuredCut = barbershopDetails.haircut_details.find(
    (haircut_detail) => haircut_detail.is_featured,
  )?.name

  const form = useForm<FormValues>({
    values: {
      isFeatured: featuredCut!,
    },
  })

  if (barbershopDetails.haircut_details.length === 0) {
    return (
      <p>
        No haircuts yet :(
        <br />
        <button onClick={nextStep} className="text-blue-400">Add a haircut</button>
      </p>
    )
  }

  console.log({ featuredCut })

  const { toast } = useToast()

  const [isUpdatingFeaturedCut, startIsUpdatingFeaturedCutTransition] =
    useTransition()

  const handleSaveChanges = async (data: FormValues) => {
    console.log({ data })
    startIsUpdatingFeaturedCutTransition(async () => {
      try {
        await updateFeaturedCut(barbershopDetails.id, data.isFeatured)
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your changes have been saved',
        })
        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSaveChanges)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem>
              <RadioGroup className="flex flex-col">
                {barbershopDetails.haircut_details.map(
                  (haircut_detail, index) => {
                    return (
                      <li
                        className={cn(
                          buttonVariants({
                            variant: 'secondary',
                            size: 'sm',
                          }),
                          'text-wrap flex h-12 justify-between gap-2 rounded-none px-6 hover:opacity-80',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            {...field}
                            checked={field.value === haircut_detail.name}
                            onClick={() => field.onChange(haircut_detail.name)}
                            value={haircut_detail.name}
                            id={haircut_detail.name}
                          />
                          <Label
                            className="cursor-pointer"
                            htmlFor={haircut_detail.name ?? undefined}
                          >
                            {haircut_detail.name}
                          </Label>
                        </div>
                        <Button
                          onClick={() => handleViewMoreInfo(haircut_detail.id)}
                          className="text-xs font-medium text-black bg-transparent hover:bg-transparent hover:underline"
                        >
                          View More Info
                        </Button>
                      </li>
                    )
                  },
                )}
              </RadioGroup>
            </FormItem>
          )}
        />
        {form.watch('isFeatured') !== featuredCut && (
          <Button  variant="save-changes">
            {isUpdatingFeaturedCut ? (
              <LoadingSpinner className="w-4 h-4 mx-auto" />
            ) : (
              'Save Changes'
            )}
          </Button>
        )}
      </form>
    </Form>
  )
}

export default CutsList
