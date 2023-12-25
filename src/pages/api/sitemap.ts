import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/xml')
      
      // Instructing the Vercel edge to cache the file
      res.setHeader('Cache-control', 'stale-while-revalidate, s-maxage=3600')
      
      // generate sitemap here
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
      <url>
        <loc>https://anatolii.tsi-ko.com/</loc>
        <lastmod>${new Date()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>https://anatolii.tsi-ko.com/resume</loc>
        <lastmod>${new Date()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
      </url>
      <url>
        <loc>https://anatolii.tsi-ko.com/resume?pdf=true</loc>
        <lastmod>${new Date()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://anatolii.tsi-ko.com/portfolio</loc>
        <lastmod>${new Date()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      </urlset>`
  
    res.end(xml)
}
