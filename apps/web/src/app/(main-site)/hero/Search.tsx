'use client'
import Urls from '@/app/urls/urls'
import AddressSearch from '@/components/AddressSearch'
import ServerSideDesktopBreakpoint from '@/components/DesktopBreakpoint'
import ServerSideMobileBreakpoint from '@/components/MobileBreakpoint'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'
import { useForm } from 'react-hook-form'
import { FaSearch } from 'react-icons/fa'
import { FaScissors } from 'react-icons/fa6'

type SearchFormValues = {
  formattedAddress: string
}

const Search = () => {
  const form = useForm<SearchFormValues>()

  const router = useRouter()

  const { placesService } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API,
    options: {
      componentRestrictions: { country: 'AU' },
    },
  })

  const onSubmit = (values: SearchFormValues) => {
    router.push(Urls.barbershops(values.formattedAddress))
  }

  return (
    <div
      // Not sure why max-w isn't working with tailwind but oh well
      style={{ maxWidth: '672px' }}
      className="flex w-full items-center rounded-3xl bg-white px-2 py-2 shadow-2xl ring-red-300 focus:ring-4"
    >
      <FaScissors className="ml-2 hidden text-purple-500 lg:block" size={18} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full items-center justify-between"
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
                    placeHolder="Search near me (e.g. CBD, Melbourne)"
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
          <button className="poppins transform rounded-2xl bg-primary bg-purple-500 p-4 text-sm text-white ring-red-300 transition hover:opacity-80 focus:ring-4 lg:rounded-full lg:px-8">
            <ServerSideMobileBreakpoint>
              <FaSearch size={14} />
            </ServerSideMobileBreakpoint>
            <ServerSideDesktopBreakpoint>
              <p className="font-primary text-md font-bold">Search</p>
            </ServerSideDesktopBreakpoint>
          </button>
        </form>
      </Form>
    </div>
  )
}

export default Search
