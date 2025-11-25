import * as Sentry from '@sentry/nextjs'

const withSentry = <P extends readonly unknown[], T>(
  fn: (...args: P) => Promise<T>,
): ((...args: P) => Promise<T>) => {
  return async (...innerArgs) => {
    try {
      return await fn(...innerArgs)
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
export default withSentry
