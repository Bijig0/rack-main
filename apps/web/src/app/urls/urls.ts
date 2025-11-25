const Urls = {
  home: '/',
  barbershopsDetail: (barbershopName: string) =>
    `/barbershops/${barbershopName}`,
  barbershopStart: '/barbershop-start',
  dashboard: '/dashboard',
  'for-businesses': '/for-businesses',
  barbershops: (address: string) => `/barbershops?address=${address}`,
  login: '/login',
  signUp: '/signup',
  'reset-email-redirect': '/reset-email-redirect',
  'password-reset': '/password-reset',
  'privacy-policy': '/privacy-policy',
  'data-deletion-instructions': '/data-deletion-instructions',
  blogs: '/blogs',
  blogsDetail: (slug: string) => `/blogs/${slug}`,
}

export default Urls
