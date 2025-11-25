/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://taperau.com',
  generateRobotsTxt: true, // (optional)
  sitemapSize: 7000,
  exclude: ['/server-sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://taperau.com/server-sitemap.xml', // <==== Add here
    ],
  },
  // ...other options
}
