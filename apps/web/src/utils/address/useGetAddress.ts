'client-only'
import { useQuery } from '@tanstack/react-query'
import { useGeolocated } from 'react-geolocated'
import { z } from 'zod'
import { GoogleGeoEncodingSchema } from './mapbox-types'

type Address = {
  formattedAddress: string
}

const reverseGeoEncoding = async (
  latitude: number,
  longitude: number,
): Promise<Address> => {
  const createGeoEncodingUrl = (latitude: number, longitude: number) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API}`
    console.log({ url })
    return url
  }

  const geoEncodingUrl = createGeoEncodingUrl(latitude, longitude)
  const response = await fetch(geoEncodingUrl)
  const data = await response.json()
  console.log({ data })
  const parsedData = GoogleGeoEncodingSchema.parse(data)
  console.log({ parsedData })
  const formattedAddress = parsedData.results[0].formatted_address
  if (!formattedAddress) throw new Error('No address found')
  return { formattedAddress }
}

const devReverseGeoEncoding = async (): Promise<Address> => {
  const formattedAddress = 'Latrobe Street, Melbourne'
  return { formattedAddress }
}

const ipSchema = z.object({ ip: z.string() })

const locationSchema = z.object({
  city: z.object({
    name: z.string(),
  }),
})

const getIpAddressGeolocation = async (): Promise<Address> => {
  const createIpToLocationUrl = (ipAddress: string) => {
    console.log({ ipAddress })
    const url = `https://api.geoapify.com/v1/ipinfo?ip=${ipAddress}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
    console.log({ url })
    return url
  }
  const ipAddress = await fetch('https://api.ipify.org?format=json')
  const ipJson = await ipAddress.json()
  console.log({ ipJson })
  const { ip } = ipSchema.parse(ipJson)
  const ipToLocationUrl = createIpToLocationUrl(ip)
  const response = await fetch(ipToLocationUrl)
  const data = await response.json()
  console.log({ data })
  const parsedLocation = locationSchema.parse(data)
  console.log({ parsedLocation })
  const formattedAddress = parsedLocation.city.name

  return { formattedAddress }
}

const devGetIpAddressGeolocation = async (): Promise<Address> => {
  const formattedAddress = 'Latrobe Street, Melbourne'
  return { formattedAddress }
}

const useGetAddress = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    })

  const canGetSpecificAddress =
    isGeolocationAvailable && isGeolocationEnabled && coords

  console.log({ canGetSpecificAddress })

  const getQueryFn = () => {
    if (canGetSpecificAddress) {
      return process.env.NODE_ENV === 'production'
        ? reverseGeoEncoding(coords!.latitude, coords!.longitude)
        : devReverseGeoEncoding()
    } else if (!canGetSpecificAddress) {
      return process.env.NODE_ENV === 'production'
        ? getIpAddressGeolocation()
        : devGetIpAddressGeolocation()
    }
  }

  const specificAddress = useQuery({
    queryFn: () => getQueryFn(),
    queryKey: [coords?.latitude, coords?.longitude],
    retry: false,
    // throwOnError: true,
  })

  return specificAddress
}

export default useGetAddress
