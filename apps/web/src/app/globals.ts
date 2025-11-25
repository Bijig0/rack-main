export const PLACEHOLDER_IMAGE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png'

export const SUPABASE_STORAGE_BASE_PATH =
  'https://agslweirgmorisihaqbz.supabase.co/storage/v1/object/public'

export const createBarbershopStoragePath = () => {
  return `${SUPABASE_STORAGE_BASE_PATH}/barbershop`
}

export const PLACEHOLDER_BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAW0AAAGaBAMAAAA2uA+wAAAAAXNSR0IArs4c6QAAAC1QTFRF2tzf4OHk////3+Dk+/v73N3h5OXj3Nzi497t49/t29rk3c7/3c//3dD/2trkngSj9wAAAfRJREFUeJzt28FpQmEQRtFfRIS3sIaQSlykEFf2kl229uIiBUR4DdhLujgwcE8Fdzcw8K3D50Qf6/g10XWd7hPd1vn7MdDP2p5/A/2u7fUeaK+bqtuq26rbqtuq26rbqtuq26rbqtuq26rbqtua232pG6rbqtuq26rbqtuq26rbqtuq26rbqtuq26rbqtuq26rbqtuq26rbqtuq26rbqtuq26rbqtuq26rbqtuq26rbqtuq25q7y6hbqtuq26rbqtuq26rbqtuq26rbqtua2z3171O3VLdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3Nbd76k63bqluq25rbvfUu1O3VLdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt1W3VbdVt7X/Ayc7FRl4geUWAAAAAElFTkSuQmCC'

export const TAPER_INSTAGRAM_URL = 'https://www.instagram.com/taperau/'

export const DEV_SITE_URL = 'http://localhost:3000'

export const PROD_SITE_URL = 'https://www.taperau.com'

export const getSiteUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return DEV_SITE_URL
  } else {
    return PROD_SITE_URL
  }
}
