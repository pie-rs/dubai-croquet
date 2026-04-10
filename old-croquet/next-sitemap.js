const SITE_URL = process.env.SITE_URL
const ENV = process.env.ENVIRONMENT
const shouldIndex = ENV !== 'staging'

const policies = shouldIndex
  ? [{ userAgent: '*', allow: '/' }]
  : [{ userAgent: '*', disallow: '/' }]

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies,
  },
  outDir: './out',
};
