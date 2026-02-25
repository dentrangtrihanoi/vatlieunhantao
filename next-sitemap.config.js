/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://xinghiepcokhi.info',
    generateRobotsTxt: true,
    sitemapSize: 7000,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/studio', '/api', '/studio/'],
            },
        ],
        additionalSitemaps: [
            `${process.env.SITE_URL || 'https://xinghiepcokhi.info'}/sitemap.xml`,
        ],
    },
}