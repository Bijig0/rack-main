import { useTheme } from 'next-themes'

export const useBrandColors = ({
  brandColor,
  darkBrandColor,
  theme,
}: {
  brandColor?: string
  darkBrandColor?: string
  theme?: string | null
}) => {
  const brandTheme = useGetBrandingColours({
    lightVal: brandColor,
    darkVal: darkBrandColor,
  })

  useCalcomTheme(brandTheme)
  useTheme(theme)
}
