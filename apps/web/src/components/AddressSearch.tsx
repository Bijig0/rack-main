'use client'
import { BaseInput } from '@/components/ui/base-input'
import { LoadingSpinner } from '@/components/ui/spinner'
import { cn } from '@/utils/tailwind'
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'
import { ControllerRenderProps, FieldPath } from 'react-hook-form'
import { useBoolean } from 'usehooks-ts'
import {
  PlaceDetailsSchema,
  placeDetailsSchema,
} from '../app/barbershop-details/barber-info/placeDetailsSchema'

type Props<
  FormValues extends Record<PropertyKey, any>,
  AddressKey extends FieldPath<FormValues>,
> = Partial<ControllerRenderProps<FormValues, AddressKey>> & {
  afterSelect?: (placeDetails: PlaceDetailsSchema) => void
  inputClassName?: string
  containerClassName?: string
  placeHolder?: string
}

const AddressSearch = <
  FormValues extends Record<PropertyKey, any>,
  AddressKey extends FieldPath<FormValues>,
>(
  props: Props<FormValues, AddressKey>,
) => {
  const {
    onChange,
    afterSelect,
    containerClassName,
    inputClassName,
    placeHolder,
    ...rest
  } = props
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API,
    options: {
      componentRestrictions: { country: 'AU' },
    },
  })

  const {
    value: isPredictionClicked,
    toggle: toggleIsPredictionClicked,
    setTrue: setPredictionIsClicked,
    setFalse: setPredictionIsNotClicked,
  } = useBoolean(false)

  const handleSelectAddress = (place: any) => {
    placesService?.getDetails(
      {
        placeId: place.place_id,
      },
      (placeDetails: unknown) => {
        const parsedPlaceDetails = placeDetailsSchema.parse(placeDetails)
        onChange?.(parsedPlaceDetails.formatted_address)
        setPredictionIsClicked()
        afterSelect?.(parsedPlaceDetails)

        console.log({ parsedPlaceDetails })
      },
    )
  }

  const isPredictionsPresent = placePredictions.length > 0

  const showPredictions = isPredictionsPresent && !isPredictionClicked

  return (
    <div className={cn('relative', containerClassName)}>
      <BaseInput
        onChange={(evt) => {
          onChange?.(evt.target.value)
          setPredictionIsNotClicked()
          getPlacePredictions({ input: evt.target.value })
        }}
        className={inputClassName}
        placeholder={placeHolder}
        {...rest}
      />
      <div
        id="dropdown"
        className={cn(
          'absolute z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700',
          showPredictions ? 'block' : 'hidden',
        )}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          {isPlacePredictionsLoading ? (
            <LoadingSpinner className="mx-auto h-4 w-4" />
          ) : (
            placePredictions.map((prediction) => (
              <li
                className="cursor-pointer"
                onClick={() => handleSelectAddress(prediction)}
                key={prediction.place_id}
              >
                <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  {prediction.description}
                </p>
              </li>
            ))
          )}
          {}
        </ul>
      </div>
    </div>
  )
}

export default AddressSearch
