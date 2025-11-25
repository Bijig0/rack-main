import { BaseInput } from '@/components/ui/base-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
type BarbershopDetailsFormValues = {
  name: string
  address: string
  about: string
}

type ProfileFormValues = {
  barbershopDetails: BarbershopDetailsFormValues
}

export default function ProfileForm() {
  const form = useForm<ProfileFormValues>({})

  const { handleSubmit } = form

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="barbershopDetails.name"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="block">Barbershop Name</FormLabel>
                <a
                  href="/dashboard"
                  className="text-sm text-blue-400 underline"
                >
                  Edit
                </a>
              </div>
              <FormControl>
                <BaseInput disabled placeholder="TaperAU" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barbershopDetails.address"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="block">
                  Barbershop Address/Region
                </FormLabel>
                <a
                  href="/dashboard"
                  className="text-sm text-blue-400 underline"
                >
                  Edit
                </a>
              </div>
              <FormControl>
                <BaseInput
                  disabled
                  placeholder="68 Brisbane Avenue"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barbershopDetails"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="block">About</FormLabel>
                <a
                  href="/dashboard"
                  className="text-sm text-blue-400 underline"
                >
                  Edit
                </a>
              </div>
              <FormControl>
                <Textarea
                  value="Lorem Ipsum Text Here"
                  disabled
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel className="block">Haircuts Offered</FormLabel>
            <a href="/dashboard" className="text-sm text-blue-400 underline">
              Edit
            </a>
          </div>
        </FormItem>
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel className="block">Barbershop Images</FormLabel>
            <a href="/dashboard" className="text-sm text-blue-400 underline">
              Edit
            </a>
          </div>
        </FormItem> */}
      </form>
    </Form>
  )
}
