import { renderToStaticMarkup } from 'react-dom/server';
import puppeteer, { Page, Viewport } from 'puppeteer';
import { getImageFromName } from '@/pages/api/resume/file/[...slug]';

const IMG_RE = /<img(.|\n)*src="([^"]*)/g;
const EXT_RE = /(?:\.([^.]+))?$/;

export const preparePage = async (component: any, imageUrl: string, imagesPath: string, callback: (page: Page) => Promise<void>,
                                  viewport: Viewport = {width: 0, height: 0}) => {
    let html = renderToStaticMarkup(component);
    let match;
    do {
        match = IMG_RE.exec(html);
        if (match) {
            let url = match[2];
            const imageName = url.replace(`${imageUrl}/`, '');
            const imageBuffer = getImageFromName(imageName, imagesPath);
            let extension = 'jpeg';
            if (imageName.includes('.')) {
                let m = EXT_RE.exec(imageName);
                extension = m ? m[1] : 'jpeg';
            }
            const imageForPdf = `data:image/${extension};charset=utf-8;base64,${imageBuffer.toString('base64')}`;
            html = html.replace(match[2], imageForPdf);
        }
    } while (match);
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        ignoreHTTPSErrors :true,
        headless: 'new',
        args: [
            '--no-sandbox'
        ]
    });

    const page = await browser.newPage();
    await page.emulateMediaType('screen');
    if (viewport.width && viewport.height) {
        await page.setViewport(viewport);
    }
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    await callback(page);
        
    await browser.close();
}
