import { z } from 'zod'

const addressComponentSchema = z.object({
  long_name: z.string(),
  short_name: z.string(),
  types: z.array(
    z.enum([
      'street_number',
      'route',
      'locality',
      'political',
      'administrative_area_level_2',
      'administrative_area_level_1',
      'country',
      'postal_code',
    ]),
  ),
})

const geometryLocationSchema = z.object({
  lat: z.function(),
  lng: z.function(),
})

// const geometryViewportSchema = z.object({
//   south: z.number(),
//   west: z.number(),
//   north: z.number(),
//   east: z.number(),
// })

const geometrySchema = z.object({
  location: geometryLocationSchema,
  //   viewport: geometryViewportSchema,
})

export const placeDetailsSchema = z.object({
  //   address_components: z.array(addressComponentSchema),
  //   adr_address: z.string(),
  formatted_address: z.string(),
  geometry: geometrySchema,
  place_id: z.string(),
  url: z.string(),
  //   icon: z.string().optional(),
  //   icon_background_color: z.string().optional(),
  //   icon_mask_base_uri: z.string().optional(),
  //   name: z.string(),
  //   reference: z.string(),
  //   types: z.array(z.enum(['premise'])).optional(),
  //   utc_offset: z.number().optional(),
  //   vicinity: z.string(),
  //   html_attributions: z.array(z.unknown()).optional(), // Assuming unknown type for simplicity
  //   utc_offset_minutes: z.number().optional(),
})

export type PlaceDetailsSchema = z.infer<typeof placeDetailsSchema>
