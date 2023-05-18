import { renderToStaticMarkup } from 'react-dom/server';
import puppeteer from 'puppeteer';
import { getImageFromName } from '@/pages/api/resume/file/[...slug]';
import { API_URL } from '@/pages/api/resume/file';

const IMG_RE = /<img(.|\n)*src="([^"]*)/g;
const EXT_RE = /(?:\.([^.]+))?$/;

const componentToPDFBuffer = async (component: any) => {
    let html = renderToStaticMarkup(component);
    let match;
    do {
        match = IMG_RE.exec(html);
        if (match) {
            const imageName = match[2].replace(`${API_URL}/`, '');
            const imageBuffer = getImageFromName(imageName);
            let extension = 'jpeg';
            if (imageName.includes('.')) {
                let m = EXT_RE.exec(imageName);
                extension = m ? m[1] : 'jpeg';
            }
            const imageForPdf = `data:image/${extension};base64,${imageBuffer.toString('base64')}`;
            html.replace(match[2], imageForPdf);
        }
    } while (match);
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: 'new',
        args: [
            '--no-sandbox',
            '--headless',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--allow-file-access-from-files',
            '--enable-local-file-accesses'
        ]
    });

    const page = await browser.newPage();
    await page.setContent(html, {
        waitUntil: [
            'domcontentloaded', 
            'networkidle0', 
            'load', 
            'networkidle2'
        ], 
        timeout: 30000
    });
    await page.emulateMediaType('screen');
    const pdf = await page.pdf({
        format: 'A4',
        scale: 0.7,
        margin: {
            top: '20px',
            bottom: '20px',
            left: '20px',
            right: '20px',
        },
        printBackground: true
    });
    await browser.close();
    return pdf;
}

export default {
    componentToPDFBuffer
}
