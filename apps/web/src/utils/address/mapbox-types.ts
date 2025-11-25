import { z } from 'zod'

const ResultsArray = z.array(
  z.object({
    formatted_address: z.string(),
  }),
)

export const GoogleGeoEncodingSchema = z.object({
  results: ResultsArray,
})

export type TGoogleGeoEncodingSchema = z.infer<typeof GoogleGeoEncodingSchema>
