'use client'
import Urls from '@/app/urls/urls'
import AddressSearch from '@/components/AddressSearch'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa6'
import { Button } from '../SidebarButton'

export type FilterFormValues = {
  formattedAddress: string
}

const FilterButton = () => {
  const form = useForm<FilterFormValues>()

  const router = useRouter()

  const onSubmit = (values: FilterFormValues) => {
    router.push(Urls.barbershops(values.formattedAddress))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex w-24 cursor-pointer items-center justify-between rounded-2xl py-1 text-sm">
          <span>Filters</span> <FaPlus className="text-sm" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Form {...form}>
          <form
            autoComplete="new-password"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="formattedAddress"
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <AddressSearch
                      {...field}
                      placeHolder="Search an address/region"
                      containerClassName="w-full cursor-pointer"
                      inputClassName="cursor-pointer border-none focus:cursor-text focus:border-none focus-visible:ring-0"
                      afterSelect={(placeDetails) => {
                        form.handleSubmit(onSubmit)()
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Separator className="my-4" />
        {/* <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" className="rounded-md" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>
        </section> */}
      </PopoverContent>
    </Popover>
  )
}

export default FilterButton
