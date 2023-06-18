import { renderToStaticMarkup } from 'react-dom/server';
import puppeteer from 'puppeteer';
import { getImageFromName } from '@/pages/api/resume/file/[...slug]';
import { API_URL } from '@/pages/api/resume/file';

const IMG_RE = /<img(.|\n)*src="([^"]*)/g;
const EXT_RE = /(?:\.([^.]+))?$/;
const FOOTER_TEMPLATE = `
<div style="display: flex; justify-content: space-between; width: 297mm; font-size: 8px;">
    <div style="margin-left: 1cm; color: #969696;"> 
        Anatolii Tsirkunenko | Resume
    </div>
    <div style="margin-right: 1cm; color: #969696;"> 
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>
</div>`;

const componentToPDFBuffer = async (component: any) => {
    let html = renderToStaticMarkup(component);
    let match;
    do {
        match = IMG_RE.exec(html);
        if (match) {
            let url = match[2];
            const imageName = url.replace(`${API_URL}/`, '');
            const imageBuffer = getImageFromName(imageName);
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
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
    const pdf = await page.pdf({
        format: 'A4',
        scale: 0.65,
        margin: {
            top: '40px',
            bottom: '48px',
            left: '0',
            right: '0',
        },
        displayHeaderFooter: true,
        headerTemplate: "<div/>",
        footerTemplate: FOOTER_TEMPLATE,
        printBackground: true
    });
    await browser.close();
    return pdf;
}

export default {
    componentToPDFBuffer
}
